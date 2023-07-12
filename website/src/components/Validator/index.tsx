import React from 'react';
import find from 'lodash/find';
import startCase from 'lodash/startCase';
import Schema from '../Validator/validatorSchema';

const Validator = ({ schemas, menuContents, isDataInvalid }) =>
  schemas.length > 0 ? (
    schemas.map((schema) => {
      const menuItem = find(menuContents, { name: startCase(schema.name) });

      return (
        <Schema
          key={schema.name}
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
