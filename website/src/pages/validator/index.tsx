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
import { Display, DownloadTooltip, DownloadButtonContent, UploadButtonContent } from '../../components/common';
import { getLatestVersion } from '../../utils';
import Tabs, { Tab } from '@icgc-argo/uikit/Tabs';
import { StyledTab, TAB_STATE } from '../../components/Tabs';
import MetaValidation from '../../components/MetaValidation';
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
const data = require('./data.json')
//const PDCMLVPath = "http://localhost:3010/validation/upload-excel" // For local runs
const PDCMLVPath = "http://hh-rke-wp-webadmin-20-worker-1.caas.ebi.ac.uk:32002/validation/upload-excel"
function validatorPage() {
  // docusaurus context
  const context = useDocusaurusContext();
  const {
    siteConfig: {
      customFields: { PLATFORM_UI_ROOT = '', GATEWAY_API_ROOT = '' },
    },
  } = context;
  const [selectedTab, setSelectedTab] = useState(TAB_STATE.DETAILS);
  let [fileSubmitted, setFileSubmitted] = useState<string>("no");
  const [activeResult, setActiveResult] = useState(data);//[activeSchemas, true, ""];  
  const filteredResult = activeResult.sheetsValidationResults;
  const isDataInvalid = activeResult.status;
  const date = activeResult.date;
  const dictionaryName = activeResult.dictionaryName;
  const dictionaryVersion = activeResult.dictionaryVersion;
  const [uploadButtonText, setUploadButtonText] = useState("Upload files for validation");
  const defaultLoadingMessage = "No file submitted for validation";
  const [Loading_message, setLoadingMessage] = useState(defaultLoadingMessage);
  const fileInputRef= React.useRef(null);

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
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle upload file:
  const handleChange = (event) => {
    event.preventDefault();
    if(fileInputRef.current.files[0] !== undefined){
      setUploadButtonText(String(fileInputRef.current.files[0].name));
    }
  }


  //Handle submit data:
  const handleSubmit = async (event) => {
    event.preventDefault();
    if(event.target[0] !== null && fileInputRef.current.files[0] !== undefined){
      setFileSubmitted("no");
      
      const inputFile = fileInputRef.current.files[0];
      const formData = new FormData();
      event.preventDefault();
      formData.append("file", inputFile);
      
      setLoadingMessage("Validating your file ... ")
      
      const results = await fetch(PDCMLVPath, {
        method: "POST",
        headers: new Headers(),
        body: formData,
        }).then(response => {return response.json()})
        .catch((error) => (error));
      //document.getElementById("dictionary-details").innerHTML = JSON.stringify(results);//ReactDOMServer.renderToString(<div id='dictionary-details'>results</div>);
      if(results.hasOwnProperty("status")){
        setFileSubmitted("yes");
        setActiveResult(results);
        setLoadingMessage("")
      }
    }else{
      setLoadingMessage(defaultLoadingMessage);
    }
  };
  // Menu Contents
  const menuContents = generateMenuContents(filteredResult);
  
  return (
    <EmotionThemeProvider theme={cmTheme}>
      <div id="modalCont" className={styles.modalCont} ref={modalPortalRef} />
      <Layout permalink="validator">
      <StyleWrapper>
          <div className={styles.mainContainer}>
            <div className={styles.dict}>
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
                  <Typography variant="paragraph" color="#000">
                  Please refer to <Link to="/docs/validation/how-to-use">How-to-use</Link> for any help.
                </Typography>
                </Typography>

                <div id='file-upload' className={styles.submission}>
                    <div className="upload-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <div>
                        <Button variant="secondary" size="sm" onClick={handleButtonClick}>
                          <input id="file" name="file" type="file" ref={fileInputRef} onChange={handleChange}/><UploadButtonContent>{uploadButtonText}</UploadButtonContent>
                      </Button>
                      </div>
                      <div><Button size="sm" onClick={handleSubmit}>Validate submission</Button></div>
                      <Display visible={true}>

                      <div><Button variant="secondary" size="sm" onClick={() => {
                        setUploadButtonText("Upload files for validation");
                        setFileSubmitted("no");
                        setActiveResult(data);
                        setLoadingMessage(defaultLoadingMessage);
                        document.getElementById('file').value = null;
                        //fileInputRef.current.files[0] = null;
                        }}>
                        <Icon name="times" height="8px" css={css`padding-right: 5px;`}/>CLEAR</Button>
                      </div>
                      </Display>
                    </div> 
                </div>
              </div>
              <InfoBar>
                
                </InfoBar>
              <div id='validator'>
            <Display visible={fileSubmitted == "yes"}>
              <Row>
                <MetaValidation date={date} status={isDataInvalid} dictionaryName={dictionaryName} dictionaryVersion={dictionaryVersion}></MetaValidation>
              </Row>
              </Display>
              <div id="Loading_message" css={css`
                    margin-top: 30px;
                  `}>{Loading_message}</div> 
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
                    fileSubmitted={fileSubmitted}
                  />
                </div>
              </Display>  
            </div>        
            </div>
                       
          </div>
      </StyleWrapper>
    </Layout>
    </EmotionThemeProvider>
  );
}


export default validatorPage;
