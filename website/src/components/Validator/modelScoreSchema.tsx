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
import React  from 'react';
import Table from '../Table';
import { TagContainer } from '../Tag';
import styles from './styles.module.css';
import DefaultTag from '@icgc-argo/uikit/Tag';
import startCase from 'lodash/startCase';
import { SchemaTitle } from '../Typography';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useTheme } from 'emotion-theming';
import { Theme } from '../../styles/theme/cancermodels';
import { css } from '@emotion/core';
import { resultSchema } from '../../../types';
import { Link } from 'react-router-dom';
import Plot from 'react-plotly.js';

const HeaderName = ({ name }) => {
  const sentenceCase = startCase(name);
  return (
    <SchemaTitle>
      {sentenceCase}
    </SchemaTitle>
  );
};

type SchemaMetaProps = { status: string };

const SchemaMeta = ({ status }: SchemaMetaProps) => {
  return (
    <div css={(theme) => status}>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 11px;
        `}
      >
        <HeaderName name="Metadata Score" />
      </div>

      <div
        css={css`
          margin-bottom: 11px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: flex-start;
        `}
      >         
      </div>
    </div>
  );
};

// TODO: dont like this, cells should render based on isDiffShowing


const SchemaView = ({
  data
}: {
  data: any;
}) => {
  const context = useDocusaurusContext();
  const {
    siteConfig: {
      customFields: { GATEWAY_API_ROOT = '' },
    },
  } = context;
  /**
   * need to pass in state for Cell rendering
   * react-table rerenders everything
   */

  const modelScoreCols = [
    {
      Header: 'Model ID',
      id: 'modelID',
      width: 220,
      Cell: ({ original }) => {
        const name = original.modelid;
        return (
          <div
            css={css`
              font-size: 12px;
            `}
          >
            <div
              css={css`
                font-weight: 600;
              `}
            >
              {name}
            </div>
          </div>
        );
      },
      style: { whiteSpace: 'normal', wordWrap: 'break-word', padding: '8px' },
    },
    {
        Header: 'Model type',
        id: 'modelType',
        width: 120,
        Cell: ({ original }) => {
          const name = original.modelType;
          return (
            <div
              css={css`
                font-size: 12px;
              `}
            >
              <div
                css={css`
                  font-weight: 600;
                `}
              >
                {name}
              </div>
            </div>
          );
        },
        style: { whiteSpace: 'normal', wordWrap: 'break-word', padding: '8px' },
    },    
    {
        Header: 'Missing/Incomplete fields',
        id: 'missingFields',
        width: 320,
        Cell: ({ original }) => {
            const missingFields = original.missingFields;

            return (
              <div
                css={css`
                  font-size: 12px;
                `}
              >
                {missingFields.map((field, index) => {
                  const [sheetName, ...fieldNameParts] = field.split('.');
                  const fieldName = fieldNameParts.join('.'); // Join in case field name contains dots
      
                  return (
                    <div key={index}>
                      <strong>Sheet:</strong> {sheetName}, <strong>Field:</strong> {fieldName}
                    </div>
                  );
                })}
              </div>
            );
        },
        style: { whiteSpace: 'normal', wordWrap: 'break-word', padding: '8px' },
    },
    {
      Header: 'Metadata score',
      id: 'scorePercent',
      width: 320,
      Cell: ({ original }) => {
        const score = original.score;
        //console.log(original.modelid);
        // Determine progress bar color based on score
        let progressBarColor;
        if (score >= 75) {
          progressBarColor = '#02C332'; // High score
        } else if (score >= 50) {
          progressBarColor = '#FFB800'; // Medium score
        } else {
          progressBarColor = '#f80233'; // Low score
        }
    
        return (
          <div css={css`font-size: 12px;font-weight: bold; width: 100%`}>
              <div>{score}</div>
              <div css={css`background-color: #e0e0e0; border-radius: 4px; width: 100%; height: 20px; margin-top: 5px; `}>
                  <div css={css`background-color: ${progressBarColor}; width: ${score}%; height: 100%; border-radius: 4px; `}/>
              </div>
          </div>
        );
      },
      style: { whiteSpace: 'normal', wordWrap: 'break-word', padding: '8px' },
  }, 
  ];
  const containerRef = React.createRef<HTMLDivElement>();
  
  // Filter data by modelType
  const pdxData = data.filter(item => item.modelType.toLowerCase() == 'pdx');
  const inVitroData = data.filter(item => item.modelType.toLowerCase() != 'pdx');

  // Extract scores for each modelType
  const pdxScores = pdxData.map(item => item.score);
  const inVitroScores = inVitroData.map(item => item.score);

  // Extract MCS for each modelType
  const pdxMCS = pdxData.map(item => item.MCS);
  const inVitroMCS = inVitroData.map(item => item.MCS);

  const pdxModelIds = pdxData.map(item => item.modelid);
  const inVitroModelIds = inVitroData.map(item => item.modelid);

  console.log(pdxMCS);
  // Plot data
  const pdxplotData = [
    {
      type: 'histogram',
      x: pdxMCS[0],
      opacity: 0.7,
      marker: { color: 'blue' },
      name: 'PDX MCS Distribution',
    },
    {
      type: 'scatter',
      mode: 'markers',
      x: pdxScores,
      y: Array(pdxScores.length).fill(0), // To plot all markers at y = 0 for PDX
      marker: { color: 'red', size: 8 },
      text: pdxModelIds,
      name: 'Model ID'
    },
  ];

  const inVitroPlotData = [
    {
      type: 'histogram',
      x: inVitroMCS[0],
      opacity: 0.7,
      marker: { color: 'green' },
      name: 'In Vitro MCS Distribution',
    },
    {
      type: 'scatter',
      mode: 'markers',
      x: inVitroScores,
      y: Array(inVitroScores.length).fill(0), // To plot all markers at y = 0 for In Vitro
      marker: { color: 'purple', size: 8 },
      text: inVitroModelIds,
      name: 'Model ID'
    },
  ];

    
  // State variables for pagination
  const itemsPerPage = 10; // Number of items to display per page
  return (
    <div data-menu-title="Metadata Scores">
    <SchemaMeta status='valid' />
      <div ref={containerRef}>
        <Table
          withRowBorder={true}
          columns={modelScoreCols}
          parentRef={containerRef}
          data={data}
          showPagination={true}
          defaultPageSize={itemsPerPage}
          pageSize={itemsPerPage}
          sortable={true}
          cellAlignment="top"
          withOutsideBorder={true}
          highlight={false}
          withResizeBlur={true}
          resizable={true}
          showPageSizeOptions={false}
          withStripes={true}
        />

      </div>
      <div>
      <div>
      <Plot
          data={pdxplotData}
          layout={{
            title: 'CM.Org MCS Distribution with your PDX models',
            xaxis: { title: 'Score / MCS' },
            yaxis: { title: 'Frequency of models' },
            showlegend: true,
          }}
        />

      <Plot
          data={inVitroPlotData}
          layout={{
            title: 'CM.Org MCS Distribution with your in vitro models',
            xaxis: { title: 'Score / MCS' },
            yaxis: { title: 'Frequency of models' },
            showlegend: true,
          }}
        />
      </div>

      </div>
    </div>
  );
};

export default SchemaView;
