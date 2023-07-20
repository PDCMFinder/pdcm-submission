import React from 'react';
import find from 'lodash/find';
import startCase from 'lodash/startCase';
import Schema from '../Validator/validatorSchema';

const Validator = ({ schemas, menuContents, isDataInvalid, fileSubmitted }) =>
  schemas.length > 0 && fileSubmitted=='yes'? (
    schemas.map((schema) => {
        const menuItem = find(menuContents, { name: startCase(schema.sheetName) });
        return (
          <Schema
            key={schema.sheetName}
            schema={schema}
            menuItem={menuItem}
            isDataInvalid={isDataInvalid}
          />
        ); 
    })
  ) : (
    <div>No file submitted for validation</div>
  );

export default Validator;
