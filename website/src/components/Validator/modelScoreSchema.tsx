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


const HeaderName = ({ name }) => {
  const sentenceCase = startCase(name);
  return (
    <SchemaTitle>
      {sentenceCase} ({name})
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
        <HeaderName name="Model Score" />
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
      width: 300,
      Cell: ({ original }) => {
        const name = original.modelID;
        
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
        Header: 'Metadata score',
        id: 'score',
        width: 300,
        Cell: ({ original }) => {
          const name = original.score;
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
        Header: '',
        id: 'scorePercent',
        width: 300,
        Cell: ({ original }) => {
          const score = original.score;
      
          // Determine progress bar color based on score
          let progressBarColor;
          if (score >= 75) {
            progressBarColor = 'green'; // High score
          } else if (score >= 50) {
            progressBarColor = 'yellow'; // Medium score
          } else {
            progressBarColor = 'red'; // Low score
          }
      
          return (
                <div css={css`background-color: #e0e0e0; border-radius: 4px; width: 100%; height: 20px;`}>
                <div css={css`background-color: ${progressBarColor}; width: ${score}%; height: 100%; border-radius: 4px;`}/>
                </div>
          );
        },
        style: { whiteSpace: 'normal', wordWrap: 'break-word', padding: '8px' },
      }, 
  ];

  const containerRef = React.createRef<HTMLDivElement>();

  // State variables for pagination
  const itemsPerPage = 10; // Number of items to display per page
  return (
    <div data-menu-title="Model Scores">
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
    </div>
  );
};

export default SchemaView;