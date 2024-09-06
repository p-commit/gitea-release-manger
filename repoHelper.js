const axios = require('axios');
const fs = require('fs');
const { execSync } = require('child_process');
const FormData = require('form-data');

const createHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const createTag = async (token, giteaURL, repository, tagName, tagDescription, target) => {
  const url = `${giteaURL}/api/v1/repos/${repository}/tags?token=${token}`;
  const data = {
    message: tagDescription,
    tag_name: tagName
  };

  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log('Тег создан.');
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании тега:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const createRelease = async (token, giteaURL, repository, releaseName, releaseDescription, tagName) => {
  const url = `${giteaURL}/api/v1/repos/${repository}/releases?token=${token}`;
  const releaseData = {
    body: releaseDescription,
    draft: true,
    name: releaseName,
    prerelease: true,
    tag_name: tagName,
    target_commitish: tagName
  };

  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(url, releaseData, { headers });
    console.log('Релиз создан.');
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании релиза:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const createAttachment = async (token, giteaURL, repository, attachmentPath, attachmentName, releaseId) => {

  const fileType = 'application/x-zip-compressed';
  const url = `${giteaURL}/api/v1/repos/${repository}/releases/${releaseId}/assets?name=${attachmentName}&token=${token}`;

  const form = new FormData();
  form.append('attachment', fs.createReadStream(attachmentPath), {
    filename: attachmentName,
    contentType: fileType,
  });

  const headers = {
    ...form.getHeaders(),
    'accept': 'application/json',
  };

  try {
    const response = await axios.post(url, form, { headers });
    console.log('Вложение загружено.');
    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке вложения:', error.response ? error.response.data : error.message);
    throw error;
  }

};

module.exports = {
  createTag,
  createRelease,
  createAttachment,
};