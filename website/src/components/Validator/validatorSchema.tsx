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
    className={`${styles.tag} ${styles.fields}`}
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
          withRowBorder
          parentRef={containerRef}
          columns={cols}
          data={tableData}
          showPagination={false}
          defaultPageSize={tableData.length}
          pageSize={tableData.length}
          sortable={true}
          cellAlignment="top"
          withOutsideBorder
          highlight={false}
        />
      </div>
    </div>
  );
};

export default SchemaView;
