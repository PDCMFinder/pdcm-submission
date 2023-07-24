---
id: How-to-use
title: How-to-use
---
This guide will describe how to validate your model metadata using the [validator.](/validator).


## Example files

This is an example file. [example-clean.xlsx](../../website/static/assets/validation_example-clean.xlsx)


## How-to-use the validator

### Step 1: Download the templates and format your data

1. Navigate to [Data Dictionary](/dictionary) page and download the **TSV Template**.

2. Format your data according to the CancerModels.org data model. 


#### Tips to format your metadata file

- Open your model metada in Excel:
  - BEFORE pasting your data into the Excel spreadsheet, reformat the cells as text. To do so, select the empty cells where you will paste your data, right click and select "Format cells". Choose the "Text" option and click "Ok".
  - The first four rows of the file are reserved for the field headers. DO NOT DELETE THESE, as the headers act as important keys for data validation.
  - Paste your data under the correct header fields.
  - When you save the Excel spreadsheet, make sure the sheet names are preserved. Upon saving, you may need to confirm "do you want to keep using that format?", click "Yes".
- If you are using a text editor, make sure you have invisible characters turned on. This way you can be sure that tabs are correctly separating each field value.
- You do not need to remove any columns from the Excel file. 

### Step 2: Metadata validation

1. Once your file is formatted, head to the [validator](/validator) page for your data validation.
2. Click on **Upload data for validation** and select the your EXCEL file, and click on **Validate submission**.

### Step 3: Genrating the validatoion report and fixing the errors

1. **Validator** will generate a validation report with error, if any, which can be resolved with help of the error messages generated and by refering to the [Data dictionay.](/dictionary)

### Step 4: Submitting your models to CancerModels.org

1. After fixing the validation errors, if any, you are ready to submit your models to CancerModels.org. Please refer to [submission-overview](/docs/validation/submission-overview) for more info ...

