// ... this we can call as spread operator

export default class Handler {
    constructor(...scope) {
        console.log(scope, typeof scope);
        this.scope = scope;
        this.requesHandler = this.requesHandler.bind(this);
    }
    async requesHandler(req, res, next) {
        try {
            console.log(this.scope);
            const str = await this.somePromise();
            const str2 = await this.somePromise_1();
            // console.log(str, str2);
            res.send(`Hello World!${str}${str2}`);
        } catch (error) {

        }

    }
    somePromise() {
        return new Promise(resolve => resolve('test'));
    }
    somePromise_1() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('test')
            }, 2000);
        });
    }
}
