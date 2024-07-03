import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  'FBBXYIP8HE', // Replace with your Algolia application ID
  '8d998262aafca6a9f8ae91d0d8b4ee3f' // Replace with your Algolia search-only API key
);

export default searchClient;
