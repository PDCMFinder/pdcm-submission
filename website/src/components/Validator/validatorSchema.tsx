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
import React, { useState, useMemo, useEffect, Fragment } from 'react';
import Table from '../Table';
import Tag, { TagVariant, TAG_DISPLAY_NAME, TagContainer } from '../Tag';
import styles from './styles.module.css';
import DefaultTag, { TAG_VARIANTS } from '@icgc-argo/uikit/Tag';
import startCase from 'lodash/startCase';
import { DataTypography, SchemaTitle } from '../Typography';
import { ModalPortal } from '../../pages/dictionary';
import get from 'lodash/get';
import { styled } from '@icgc-argo/uikit';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Icon from '@icgc-argo/uikit/Icon';
import { useTheme } from 'emotion-theming';
import { Theme } from '../../styles/theme/cancermodels';
import { Script } from '../Schema/TableComponents';
import Modal from '../Modal';
import Typography from '@icgc-argo/uikit/Typography';
import CodeBlock, { CompareCodeBlock } from '../CodeBlock';
import { css } from '@emotion/core';
import union from 'lodash/union';
import { ChangeType, resultSchema } from '../../../types';
import Button from '../Button';
import { compareText } from '../CompareLegend';

const formatFieldType = (value) => {
  switch (value) {
    case null:
      return '';
    case 'string':
      return 'TEXT';
    default:
      return value.toUpperCase();
  }
};

const HeaderName = ({ name }) => {
  const sentenceCase = startCase(name);
  return (
    <SchemaTitle>
      {sentenceCase} ({name})
    </SchemaTitle>
  );
};

const FieldsTag = ({ fieldCount }) => (
  <DefaultTag
    className={`${styles.tag} ${styles.fields} ${fieldCount > 0 ? styles.invalid : styles.valid}`}
    style={{ marginTop: '3px' }}
  >{`${fieldCount} invalid row${fieldCount > 1 ? 's' : ''}`}</DefaultTag>
);


type SchemaMetaProps = { schema: resultSchema; fieldCount: number; status: string };

const SchemaMeta = ({ schema, fieldCount, status }: SchemaMetaProps) => {
  const { sheetName } = schema;
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
        <HeaderName name={sheetName} />
        <FieldsTag fieldCount={fieldCount} />
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
const getTableData = (status, fields) =>
  status
    ? fields
    : fields
        .filter((field) => {
          return field.status == 'invalid';
        })
        .map((field) => ({ ...field, status: null }));

const SchemaView = ({
  schema,
  menuItem,
  isDataInvalid,
}: {
  schema: resultSchema;
  menuItem: any;
  isDataInvalid: string;
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


  const cols = [
    {
      Header: 'Index',
      id: 'index',
      width: 50,
      Cell: ({ original }) => {
        const name = original.index;
        //console.log(original);
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
      Header: 'Field name',
      id: 'fieldName',
      width: 200,
      Cell: ({ original }) => {
        const name = original.fieldName;
        
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
      Header: 'Value',
      id: 'value',
      width: 150,
      Cell: ({ original }) => {
        const info = original.info;

        const infoMessage = info.value;
        return (
          <TagContainer>
            {infoMessage}
          </TagContainer>
        );
      },
      style: { whiteSpace: 'normal', wordWrap: 'break-word', padding: '8px'},
    },
    {
      Header: 'Error type',
      id: 'errorType',
      width: 180,
      Cell: ({ original }) => {
        const name = original.errorType;
        
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
      Header: 'Error message',
      id: 'errorMessage',
      Cell: ({ original }) => {
        const infoMessage = original.message;
        
        return (
          <TagContainer>
            {infoMessage}
          </TagContainer>
        );
      },
      style: { whiteSpace: 'normal', wordWrap: 'break-word', padding: '8px' },
    }
  ].filter((col) => (isDataInvalid=='invalid' ? true : col.id !== 'compare'));

  const containerRef = React.createRef<HTMLDivElement>();

  const theme: Theme = useTheme();
  const rowColors = theme.diffColors.schemaField;

  const tableData = getTableData(schema.status, schema.result);
  // State variables for pagination
  const itemsPerPage = 10; // Number of items to display per page
  
  //console.log(tableData);
  if(schema.status=="valid"){
    return <div ref={menuItem.contentRef} data-menu-title={menuItem.name} className={styles.schema}>
    <SchemaMeta schema={schema} fieldCount={schema.result.length} status={schema.status} />
    Metadata is valid!
    </div>
  }
  return (
    <div ref={menuItem.contentRef} data-menu-title={menuItem.name} className={styles.schema}>
    <SchemaMeta schema={schema} fieldCount={schema.result.length} status={schema.status} />

      <div ref={containerRef}>
        <Table
          withRowBorder={true}
          parentRef={containerRef}
          columns={cols}
          data={tableData}
          showPagination={true}
          defaultPageSize={itemsPerPage}
          pageSize={itemsPerPage}
          sortable={true}
          cellAlignment="top"
          withOutsideBorder={true}
          highlight={false}
          withResizeBlur={false}
          resizable={false}
          showPageSizeOptions={false}
          withStripes={true}
        />

      </div>
    </div>
  );
};

export default SchemaView;
