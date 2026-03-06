const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});

const initializeIndices = async () => {
  try {
    const candidatesIndexExists = await esClient.indices.exists({ index: 'candidates' });
    if (!candidatesIndexExists) {
      await esClient.indices.create({
        index: 'candidates',
        body: {
          mappings: {
            properties: {
              user_id: { type: 'keyword' },
              first_name: { type: 'text' },
              last_name: { type: 'text' },
              headline: { type: 'text' },
              bio: { type: 'text' },
              location: { type: 'text' },
              skills: { type: 'text' },
              years_of_experience: { type: 'integer' },
            },
          },
        },
      });
    }

    const jobsIndexExists = await esClient.indices.exists({ index: 'jobs' });
    if (!jobsIndexExists) {
      await esClient.indices.create({
        index: 'jobs',
        body: {
          mappings: {
            properties: {
              job_id: { type: 'keyword' },
              title: { type: 'text' },
              description: { type: 'text' },
              company_name: { type: 'text' },
              location: { type: 'text' },
              skills: { type: 'text' },
              employment_type: { type: 'keyword' },
              work_mode: { type: 'keyword' },
            },
          },
        },
      });
    }

    console.log('✅ Elasticsearch indices initialized');
  } catch (error) {
    console.error('❌ Elasticsearch initialization error:', error);
  }
};

module.exports = { esClient, initializeIndices };
