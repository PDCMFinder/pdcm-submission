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
import React from 'react';
import { css, jsx } from '@emotion/core';
import Layout from '@theme/Layout';
import styles from '../styles.module.css';
import StyleWrapper from '../../components/StyleWrapper';
//import validateExcelData from '../controllers/validator.controller'
import AlgoliaSearch from '../../components/AlgoliaSearch';

function HomeSplash() {
  const SplashContainer = (props) => (
    <div className={styles.homeContainer}>
      <div className={styles.homeSplashFade}>
        <div className={styles.homeWrapper}>{props.children}</div>
      </div>
    </div>
  );

  const SearchBanner = (props) => (
    <section className={styles.searchBanner}>
      <span className={styles.bannerText}>How can we help?</span>
      <div
        css={css`
          @media only screen and (max-width: 550px) {
            display: none;
          }
        `}
      >
        <AlgoliaSearch />
      </div>
    </section>
  );

  return (
    <SplashContainer>
      <SearchBanner />
    </SplashContainer>
  );
}



class ContentBlock extends React.Component {
  render() {
    const { color, title, icon } = this.props;
    return (
      <div className={styles.contentBlock} style={{ borderColor: color }}>
        <div className={styles.contentBlockHeader}>
          <span className={styles.contentBlockTitle}>{title}</span>
          <img src={icon} height={50} />
        </div>
        <div className={styles.contentBlockInner}>{this.props.children}</div>
      </div>
    );
  }
}

function validator() {
  return (
    <Layout permalink="validator" title="CancerModels.org - Data validator">
      <StyleWrapper>
          <div className={styles.mainContainer}>
              <div className={styles.heading}>
                <ContentBlock
                  title="Data Validator"
                  color="#4bcee5"
                  icon="img/icons/home/data-dictionary.svg"
                ></ContentBlock>
              </div>
              <div id='file-upload'>
                <form id='upload-form' action="http://localhost:3010/validation/upload-excel" method="POST" encType="multipart/form-data"> 
                <label htmlFor="file">File: </label>
                <input id="file" name="file" type="file" onChange={handleChange}/> 
                <input type="submit" value="Upload"/>
                </form>
              </div>  
            <div>
            <span id="response"></span>  
            </div>   
            
          </div>
      </StyleWrapper>
    </Layout>
  );
}

const handleChange = (event) => {
  const form = document.getElementById("upload-form");
  const inputFile = document.getElementById("file");
  const formData = new FormData();
  event.preventDefault();

  for (const file of inputFile.files) {
    formData.append("file", file);
  }
  console.log(formData.getAll('file'));
  console.log(validateExcelData(file));
  form.addEventListener("submit", handleSubmit);
}

const handleSubmit = async (event) => {
  const form = document.getElementById("upload-form");
  const inputFile = document.getElementById("file");
  const formData = new FormData();
  
  event.preventDefault();
  
  for (const file of inputFile.files) {
    formData.append("file", file);
  }
  
  const results = await fetch("http://localhost:3010/validation/upload-excel", {
    method: "POST",
    headers: new Headers(),
    body: formData,
    }).then(response => {console.log(response)})
    .catch((error) => ("Something went wrong!", error));
    //document.getElementById("response") = document.getElementById("upload-form").value;
  console.log(document.getElementById("upload-form").value);
};
//


export default validator;