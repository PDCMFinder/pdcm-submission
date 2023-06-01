# CancerModels.org data submission Doc Site

User documentation for the data model and data submission to CancerModels.org.

## Visit Site

[CancerModels.org: Data submission](https://www.cancermodels.org/submit)

## Contents

This docs site has been generated using [Docusaurus](https://docusaurus.io/) and built by referring to [ICGC-ARGO](https://github.com/icgc-argo/argo-docs).

Documentation is written in [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) and can be found in [/docs](docs).

The website, including the Docusaurus library, custom pages and components, and all styling is kept in [/website](website).

## Dependencies

To run the docs site requires the following:

- NodeJS version 12.13+
  - This is done best using nvm (node version manager). A good summary of this process can be found here for your reference: https://gist.github.com/d2s/372b5943bce17b964a79

## Installation and setup

- Move into the website directory ...

`cd website`

- ...and install dependencies via npm:

`npm ci`

- Setup Environment config:

Copy the file `/website/.env.example` to `/website/.env`

> Note
> 
> This file contains the configuration for the Algolia search used on the site. It is not necessary to set correct values for this config to get the site to run. If you would like to have working Algolia search on while working on your local dev instance, reach out to another team member for the account values.



- Run the development server to see your edits live in the browser:

`npm start`

The site should open in a new page in your browser at the address: localhost:3000
