import React from 'react';
import find from 'lodash/find';
import startCase from 'lodash/startCase';
import Schema from '../Validator/validatorSchema';
import ModelSchema from '../Validator/modelScoreSchema';

const Validator = ({ schemas, menuContents, isDataInvalid, fileSubmitted, modelScores }) =>{
  if (isDataInvalid === 'valid') {
    return (<ModelSchema key="metadataScore" data={modelScores} />);
    }

  return schemas.length > 0 && fileSubmitted=='yes'? (
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
    <div></div>
  );
};

export default Validator;
