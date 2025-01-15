/*
* Copyright 2023 EMBL - European Bioinformatics Institute
*
* Licensed under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License. You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
* either express or implied. See the License for the specific
* language governing permissions and limitations under the
* License.
*/


/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, createRef, useEffect, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';
import Typography from '@icgc-argo/uikit/Typography';
import StyleWrapper from '../../components/StyleWrapper';
import startCase from 'lodash/startCase';
import Modal from '@icgc-argo/uikit/Modal';
import { Display, UploadButtonContent } from '../../components/common';
import DefaultTag from '@icgc-argo/uikit/Tag';
import { TAB_STATE } from '../../components/Tabs';
import MetaValidation from '../../components/MetaValidation';
import Icon from '@icgc-argo/uikit/Icon';
import Button from '../../components/Button';
import Row from '../../components/Row';
import EmotionThemeProvider from '../../styles/EmotionThemeProvider';
import cmTheme from '../../styles/theme/cancermodels';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Validator from '../../components/Validator';
import YAML from 'yaml';
import fetch from "node-fetch";
import ReactGA from "react-ga4";

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
const defaultLoadingMessage = "No file submitted for validation";

async function fetchDataFromGithub(PDCMLVPath: string, variable: string): Promise<string> {
  const url = PDCMLVPath == 'true' ? 'https://raw.githubusercontent.com/PDCMFinder/pdcm-lectern-validator/develop/k8/dev/pdcm-lectern-validator/pdcm-lectern-validator-dev-deployment.yaml': 'https://raw.githubusercontent.com/PDCMFinder/pdcm-lectern-validator/main/k8/prod/pdcm-lectern-validator/pdcm-lectern-validator-prod-deployment.yaml';
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Failed to fetch Dictionary version from GitHub`);
      }
      const yamlContent = await response.text();
      const data = YAML.parse(yamlContent);
      
      if (!data || typeof data !== 'object') {
          throw new Error(`Invalid YAML content in ${url}`);
      }
      const extractedVariable = data['spec']['template']['spec']['containers'][0]['env'];
      const dictionary_version = getObjectWithKeyAndValue(extractedVariable, 'name', variable)['value'];
      if (dictionary_version === undefined) {
          throw new Error(`Variable ${variable} not found in Dictionary version`);
      }
      return dictionary_version;
  } catch (error) {
      console.error(`Error fetching data from GitHub: ${error.message}`);
      throw error;
  }
}

const fetchScores = async (): Promise<any[]> => {
  const response = await fetch('https://www.cancermodels.org/api/search_index?select=scores');
  const data = await response.json();
  //console.log(data);
  return data;
};

const transformScores = (data: any[]): { [key: string]: number[] } => {
  const transformed: { [key: string]: number[] } = { 'In Vitro': [], 'PDX': [] };

  data.forEach((item: any) => {
    const scores = item.scores;

    // Add in vitro metadata scores
    if (scores.in_vitro_metadata_score > 0) {
      transformed['In Vitro'].push(scores.in_vitro_metadata_score);
    }

    // Add PDX metadata scores
    if (scores.pdx_metadata_score > 0) {
      transformed['PDX'].push(scores.pdx_metadata_score);
    }
  });
  return transformed;
};


interface MyObject {
  [key: string]: any;
}

function getObjectWithKeyAndValue(array: MyObject[], key: string, value: any): MyObject | undefined {
  return array.find(obj => obj[key] === value);
}

function validatorPage() {
  // docusaurus context
  const context = useDocusaurusContext();
  const PDCMLVPath = process.env.REACT_APP_DEV == 'false' ? process.env.REACT_APP_PDCM_LECTERN_VALIDATOR_PROD : process.env.REACT_APP_PDCM_LECTERN_VALIDATOR_DEV;
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
  const modelScores = activeResult.modelScore;
  

  const date = activeResult.date;
  const dictionaryName = activeResult.dictionaryName;
  const dictionaryVersion = activeResult.dictionaryVersion;
  const [uploadButtonText, setUploadButtonText] = useState("Upload files for validation");
  const [Loading_message, setLoadingMessage] = useState(defaultLoadingMessage);
  const [lectern_dict_version, setLecternDictVersion] = useState(null);
  const [mcsDistribution, setMCSDistribution] = useState(null);
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
  useEffect(() => {
    // Flag to track if the component is mounted
    let isMounted = true;

    // Fetch dictionary version
    const fetchDictVersion = async () => {
      try {
        const version = await fetchDataFromGithub(process.env.REACT_APP_DEV, "DICTIONARY_VERSION");
        if (isMounted) {
          setLecternDictVersion(version);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch MCS distribution
    const fetchmcsData = async () => {
      try {
        const rawData = await fetchScores();
        const transformedData = transformScores(rawData);
        if (isMounted) {
          setMCSDistribution(transformedData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDictVersion();
    fetchmcsData();

    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, []);  // Empty dependency array means this runs only once when the component mounts

  const updatedModelScores = React.useMemo(() => {
    if (Object.keys(modelScores).length === 0) {
      return {}; // or whatever fallback you prefer
    }
  
    return modelScores.map(item => ({
      ...item,
      MCS: item.modelType.toLowerCase() === 'pdx' ? mcsDistribution.PDX : mcsDistribution["In Vitro"],
    }));
  }, [modelScores, mcsDistribution]);
  

  //Handle submit data:
  const handleSubmit = async (event) => {
    ReactGA.event('validate', {category: "event", value: 1});
    event.preventDefault();
    if(event.target[0] !== null && fileInputRef.current.files[0] !== undefined){
      setFileSubmitted("no");
      
      const inputFile = fileInputRef.current.files[0];
      const allowedFormats = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
      if(inputFile && allowedFormats.includes(inputFile.type)){
        const formData = new FormData();
        event.preventDefault();
        formData.append("file", inputFile);
        
        setLoadingMessage("Validating your file ... ")
        
        const results = await fetch(PDCMLVPath, {
          method: "POST",
          headers: new Headers(),
          body: formData,
          referrerPolicy: "unsafe-url",
          }).then(response => {
            if (response.status === 200 || response.status ===201 || response.status === 202 || response.ok) {
            // Successful response
            return response.json();   
          } else if (response.status === 400) {
            // Bad Request
            setLoadingMessage("Error processing file, please check the file and try again.")
          } else if (response.status === 401) {
            // Unauthorized
            setLoadingMessage("Error submitting file, please try again later.");
          }})
          .catch((error) => {console.error('HTTP error:', error)});
          if(results.hasOwnProperty("status")){
            setFileSubmitted("yes");
            setActiveResult(results);
            setLoadingMessage("")
          }
        //document.getElementById("dictionary-details").innerHTML = JSON.stringify(results);//ReactDOMServer.renderToString(<div id='dictionary-details'>results</div>);
      }else{
        setLoadingMessage("Invalid file format. Please upload an excel file.")
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
                  Metadata validator
                  <Typography variant="paragraph" color="#000">
                  Dictionary version: CancerModels_Dictionary v.{lectern_dict_version}
                  </Typography>
                  <Typography variant="paragraph" color="#000">
                  Please refer to <Link to="/docs/validation/how-to-use">How-to-use</Link> for any help or contact us by sending an <a href="mailto:helpdesk@cancermodels.org?Subject=Validation errors" target="_top">email</a>.
                  </Typography>
                </Typography>
                <div id='file-upload' className={styles.submission}>
                    <div className="upload-container" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <div css={css`margin-right: 5px`}>
                        <Button variant="secondary" size="sm" onClick={handleButtonClick}>
                          <input id="file" name="file" type="file" ref={fileInputRef} onChange={handleChange}/><UploadButtonContent>{uploadButtonText}</UploadButtonContent>
                      </Button>
                      </div>
                      <div css={css`margin-right: 5px`}><Button size="sm" onClick={handleSubmit}>Validate submission</Button></div>

                      <div css={css`margin-right: 5px;`} >
                        <Button variant="secondary" size="sm" onClick={() => {
                        setUploadButtonText("Upload files for validation");
                        setFileSubmitted("no");
                        setActiveResult(data);
                        setLoadingMessage(defaultLoadingMessage);
                        (document.getElementById('file') as HTMLInputElement).value = null;
                        //fileInputRef.current.files[0] = null;
                        }}>
                        <Icon name="times" height="8px" css={css`padding-right: 5px`}/>CLEAR</Button>
                      </div>
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
              <div css={css`display: flex;flex-direction: row;align-items: center;margin-bottom: 11px;`}>
              <div><Typography variant="title">Validation status </Typography></div><div><DefaultTag className={`${styles.tag} ${styles.fields} ${isDataInvalid=='invalid' ? styles.invalid : styles.valid}`}style={{ marginTop: '3px' }}>Submission is { isDataInvalid }</DefaultTag></div>
              
      </div>
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
                    modelScores={updatedModelScores}
                    mcsDistribution={mcsDistribution}
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
