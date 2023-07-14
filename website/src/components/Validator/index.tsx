import React from 'react';
import find from 'lodash/find';
import startCase from 'lodash/startCase';
import Schema from '../Validator/validatorSchema';

const Validator = ({ schemas, menuContents, isDataInvalid }) =>
  schemas.length > 0 && isDataInvalid=='invalid'? (
    schemas.map((schema) => {
      if(schema.status=="invalid"){
        const menuItem = find(menuContents, { name: startCase(schema.sheetName) });
        console.log(schemas);  
        console.log(menuItem);  
        return (
          <Schema
            key={schema.sheetName}
            schema={schema}
            menuItem={menuItem}
            isDataInvalid={isDataInvalid}
          />
        );  
      }
      return <div>Sheet is valid!</div>
    })
  ) : (
    <div>No file submitted for validation</div>
  );

export default Validator;
