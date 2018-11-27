import swaggerJSDoc from 'swagger-jsdoc';
import config       from 'config';

const swaggerDefinition = {
    info: {
        title: 'PWC Clients Management Domain API\'S',
        version: '1.0.0',
        description: 'PWC',
    },
    basePath: config.get('v1_base_path')
};

const options = {
    swaggerDefinition,
    apis: ['docs/*_swagger.js'], // <-- not in the definition, but in the options
};

export default swaggerJSDoc(options);