/*
 * Copyright (c) 2020 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of the GNU Affero General Public License v3.0.
 * You should have received a copy of the GNU Affero General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 *
 */

/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, createRef, useEffect, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import * as ReactDOMServer from 'react-dom/server';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';
import Typography from '@icgc-argo/uikit/Typography';
import StyleWrapper from '../../components/StyleWrapper';
import FileFilters, {
  NO_ACTIVE_FILTER,
  generateFilter,
  generateComparisonFilter,
  createFilters,
  attributeFilter,
  tierFilter,
  comparisonFilter,
  defaultSearchParams,
  DEFAULT_FILTER,
} from '../../components/FileFilters';
import TreeView from '../../components/TreeView';
import startCase from 'lodash/startCase';
import Modal from '@icgc-argo/uikit/Modal';
import SchemaMenu from '../../components/ContentMenu';
import { Display, DownloadTooltip, DownloadButtonContent } from '../../components/common';
import { getLatestVersion } from '../../utils';
import Tabs, { Tab } from '@icgc-argo/uikit/Tabs';
import { StyledTab, TAB_STATE } from '../../components/Tabs';
import Meta from '../../components/Meta';
import Icon from '@icgc-argo/uikit/Icon';
import OldButton from '@icgc-argo/uikit/Button';
import Button from '../../components/Button';
import { ResetButton } from '../../components/Button';
import CompareLegend, { generateComparisonCounts } from '../../components/CompareLegend';
import Row from '../../components/Row';
import VersionSelect from '../../components/VersionSelect';
import EmotionThemeProvider from '../../styles/EmotionThemeProvider';
import cmTheme from '../../styles/theme/cancermodels';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Validator from '../../components/Validator';
import { createSchemasWithDiffs, getDictionary, getDictionaryDiff } from '../../helpers/schema';
import { ChangeType, Schema, validationResults, resultSchema } from '../../../types';

const InfoBar = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #dcdde1;
  padding-bottom: 8px;
`;

export const useModalState = () => {
  const [visibility, setVisibility] = useState(false);

  const setModalVisibility = (visibility) => {
    setVisibility(visibility);
    const bodyClassList = document.getElementsByTagName('html')[0].classList;
    if (visibility) {
      bodyClassList.add('modal-open');
    } else {
      bodyClassList.remove('modal-open');
    }
  };

  return [visibility, setModalVisibility];
};

const modalPortalRef = React.createRef<HTMLDivElement>();

export const ModalPortal = ({ children }) => {
  const ref = modalPortalRef.current;
  return ref
    ? ReactDOM.createPortal(
        <div style={{ width: '100vw', height: '100vh' }}>
          <Modal.Overlay>{children}</Modal.Overlay>
        </div>,
        ref,
      )
    : null;
};

let data = require('./data.json');
//const [activeSchemas, setActiveSchemas] = useState<resultSchema[]>(data.sheetsValidationResults);

//const preloadedDictionary = { data: data.dictionary, version: data.currentVersion.version };

// versions
//const versions: Array<{ version: string; date: string }> = data.versions;

function validatorPage() {
  // docusaurus context
  const context = useDocusaurusContext();
  const {
    siteConfig: {
      customFields: { PLATFORM_UI_ROOT = '', GATEWAY_API_ROOT = '' },
    },
  } = context;
  const [selectedTab, setSelectedTab] = React.useState(TAB_STATE.DETAILS);
  
  const activeResult = {result: data.sheetsValidationResults, status: data.status};//[activeSchemas, true, ""];
  const filteredResult = activeResult.result;
  const isDataInvalid = activeResult.status;
  
  const generateMenuContents = (activeSchemas) => {
    const activeSchemaNames = activeSchemas.map((s) => s.sheetName);
    return activeSchemas.map((schema) => ({
      key: schema.sheetName,
      name: startCase(schema.sheetName),
      contentRef: createRef(),
      active: false,
      disabled: !activeSchemaNames.includes(schema.name),
    }));
  };

  // Menu Contents
  const menuContents = generateMenuContents(filteredResult);
  //const menuContents = ""//require('./data.json');
  //console.log(activeSchemas);
  return (
    <EmotionThemeProvider theme={cmTheme}>
      <div id="modalCont" className={styles.modalCont} ref={modalPortalRef} />
      <Layout permalink="validator" title="CancerModels.org - Data validator">
      <InfoBar>
      <StyleWrapper>
          <div className={styles.mainContainer}>
              <div className={styles.heading}>
                <Typography
                  color="#151c3d"
                  css={{
                    fontSize: '28px',
                    display: 'inline-block',
                    marginRight: '55px',
                    flexShrink: 0,
                  }}
                  as="h1"
                >
                  Data validator
                </Typography>
                <div id='file-upload'>
                  <form id='upload-form' method="POST" encType="multipart/form-data"> 
                    <label htmlFor="file">File: </label>
                    <input id="file" name="file" type="file" onChange={handleChange}/> 
                    <input type="submit" value="Upload"/>
                  </form>
              </div>
              </div>
              <div id="dictionary-details"></div>            
          </div>
      </StyleWrapper>
      </InfoBar> 
      <div>
            <div id="response">
             <table id='validation'></table> 
            </div>
            <div> 
            <Display visible={selectedTab === TAB_STATE.DETAILS}>
                <div
                  css={css`
                    margin-top: 30px;
                  `}
                >
                  <Validator
                    schemas={filteredResult}
                    menuContents={menuContents}
                    isDataInvalid={isDataInvalid}
                  />
                </div>
              </Display>  
            </div>  
      </div>
    </Layout>
    </EmotionThemeProvider>
  );
}
const handleChange = (event) => {
  const form = document.getElementById("upload-form");
  const inputFile = event.target.files[0];
  const formData = new FormData();
  event.preventDefault();
  formData.append("file", inputFile);
  //console.log(handleSubmit(event));
  form.addEventListener("submit", handleSubmit);
}

const handleSubmit = async (event) => {
  const form = document.getElementById("upload-form");
  event.preventDefault();
  const inputFile = event.target[0].files[0]
  const formData = new FormData();
  event.preventDefault();
  formData.append("file", inputFile);
  
  const results = await fetch("http://hh-rke-wp-webadmin-20-worker-1.caas.ebi.ac.uk:32002/validation/upload-excel", {
    method: "POST",
    headers: new Headers(),
    body: formData,
    }).then(response => {return response.json()})
    .catch((error) => (error));
  //document.getElementById("dictionary-details").innerHTML = JSON.stringify(results);//ReactDOMServer.renderToString(<div id='dictionary-details'>results</div>);
  const resultTable = results.sheetsValidationResults.map((info, i)=>{if(info.status=="invalid"){
    return(
    <div key={i}  
    css={css`
    font-weight: 600;
    margin-top: 30px;
    width: 100%;
    top: 8px;
    font-weight: bold;
  `}>
      {info.sheetName}
<div><br></br>      
          <table key={i} css={css`
    font-weight: 300;
  `}>
          <thead>
                   <tr>
                   <th>Index</th>
                   <th>Field name</th>
                   <th>Value</th>
                   <th>Error type</th>
                   <th>Error message</th>
                   </tr>
               </thead>
               <tbody>
                  {info.result.map((data, j)=>{return(
                    <tr key={j}>
                    <td>{data.index}</td>
                    <td>{data.fieldName}</td>
                    <td>{data.info.value}</td>
                    <td>{data.errorType}</td>
                    <td>{data.message}</td>
                    </tr>
                  )})}
               </tbody>
         </table>
         </div>
    </div>   
)}else{
  return(
    <div key={i}  css={css`
    font-weight: 600;
    margin-top: 30px;
    width: 100%;
    top: 8px;
    font-weight: bold;
  `}>
      {info.sheetName}<div css={css`
              font-weight: 300;
            `}>
      Sheet is valid!
        </div></div>
      
  )
}
});

const formTable = <div id="repsonse">
  <div className={styles.heading}>
  Date submitted: {results.date}<br></br> 
  Validation status: {results.status}<br></br>
  Dictionary: {results.dictionaryName} (Version: {results.dictionaryVersion})<br></br>
  </div>
              {resultTable}
  </div>;
document.getElementById("response").innerHTML = ReactDOMServer.renderToString(formTable);
};

export default validatorPage;
