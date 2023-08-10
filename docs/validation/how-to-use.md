---
id: how-to-use
title: How to use
platform_key: DOCS_HOW_TO_USE
---
This document is a guide will describe how to validate your model metadata using the CancerModels.org Model Metadata [Validator.](/validator). This tool ensures that your model metadata adheres to the required format and guidelines, ensuring accuracy and consistency in your submissions. Let's walk through the steps to successfully validate your model metadata.

## Example files

Before we begin, let's take a look at some example files for context:

- [Example Clean File (example-clean.xlsx)](/assets/validation_example-clean.xlsx).
- [Example Error FIle (example-error.xlsx)](/assets/validation_example-error.xlsx).


## How-to-use the validator

### Step 1: Download the templates and format your data

- Go to the [Data Dictionary](/dictionary) page and download the **TSV Template**.
- Format your data according to the CancerModels.org data model. 

#### Tips to format your metadata file

- Open your model metadata in Excel:
  - **BEFORE** pasting data, reformat cells as text: Right-click empty cells, choose "Format cells," select "Text," and click "Ok."
  - **Do not delete** the first four rows reserved for field headers; they're vital for validation.
  - Paste your data under the correct header fields.
- Save the Excel spreadsheet with **preserved sheet names**. Confirm to "keep using that format" if prompted..
- If you are using a text editor, make sure you have **invisible characters** turned on. This way you can be sure that tabs are correctly separating each field value.
- You do not need to remove any columns from the Excel file. 

### Step 2: Metadata validation

- Once your file is formatted, head to the [validator](/validator) page for your data validation.
- Click on **Upload data for validation** and select the your EXCEL file, and click on **Validate submission**.

### Step 3: Generating the validation report and fixing the errors

- The **validator** will generate a validation report highlighting errors, if any. Use the error messages and refer to the [Validation Report](/docs/validation/error-report) and [Data Dictionay](/dictionary) for guidance on resolving issues.


By following these steps, you ensure that your model metadata is correctly formatted and validated, increasing the accuracy and reliability of your submissions. If you have any questions, feel free to refer to the provided resources or [reach out to our team](https://www.cancermodels.org/contact).

After resolving validation errors, you're ready to submit your models to CancerModels.org. For more detailed instructions, refer to the [Submission Overview](/docs/submission/submission-overview).

Happy validating and submitting your valuable models to CancerModels.org!