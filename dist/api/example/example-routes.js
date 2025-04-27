"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleRoutes = void 0;
const example_controller_1 = require("./example-controller");
const auth_1 = require("../../utilities/auth");
// get meants get stuff from the server, post means send stuff to the server
class ExampleRoutes {
    static init(router) {
        router.route('/api/example')
            .get(example_controller_1.ExampleController.getExample)
            .post(example_controller_1.ExampleController.postExample);
        router.route('/api/example2').get(auth_1.Auth.protected, example_controller_1.ExampleController.getExample);
        router.route('/api/example/:id')
            .put(example_controller_1.ExampleController.updateExample)
            .delete(example_controller_1.ExampleController.deleteExample);
    }
}
exports.ExampleRoutes = ExampleRoutes;
//# sourceMappingURL=example-routes.js.map