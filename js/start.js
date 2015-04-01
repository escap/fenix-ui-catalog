/*global define */

define(["fx-cat-br/controllers/Fx-catalog-page",
        "fx-cat-br/controllers/Fx-catalog-filter",
        "fx-cat-br/widgets/filter/Fx-catalog-collapsible-menu",
        "fx-cat-br/widgets/filter/Fx-catalog-modular-form",
        "fx-cat-br/widgets/filter/Fx-catalog-resume-bar",
        "fx-cat-br/structures/Fx-fluid-grid",
        "fx-cat-br/widgets/bridge/Fx-catalog-bridge",
        "fx-cat-br/controllers/Fx-catalog-results",
        "fx-cat-br/widgets/results/Fx-catalog-results-generator",
        "fx-cat-br/structures/Fx-filterable-grid",
        'fx-cat-br/widgets/storage/SessionStorage',
        "text!fx-cat-br/html/fx_catalog_structure.html"
    ],
    function (Controller, FilterController, Menu, Form, Resume, FluidForm, Bridge, ResultController, ResultsRenderer, FilterableGrid, Storage, structure) {

        var html_ids = {
            MAIN_CONTAINER: "#catalogContainer",
            MENU: "fx-catalog-modular-menu",
            FORM: "fx-catalog-modular-form",
            SUBMIT: "fx-catalog-submit-btn",
            RESULT: "fx-catalog-results",
            RESUME: "fx-resume"
        };

        function Start(o) {
            this.o = o || {};
        }

        Start.prototype.init = function (options) {

            $.extend(this.o, options);

            if (!this.o.hasOwnProperty('container')) {
                throw 'Catalog needs a container!'
            }

            $(this.o.container).html(structure);

            this.pageController = new Controller();

            // Perform dependency injection by extending objects
            $.extend(this.pageController, {
                filter: this.initFilter(),
                bridge: this.initBridge(),
                results: this.initResults(),
                storage: new Storage()
            });

            if (this.o.manualRender !== true) {
                this.pageController.render();
            }

            return this.pageController;
        };

        Start.prototype.initFilter = function () {

             this.filterController = new FilterController();
                 var menu = new Menu(),
                form = new Form(),
                resume = new Resume(),
                grid = new FluidForm();

            menu.init({
                container: document.querySelector("#" + html_ids.MENU)
            });
            form.init({
                container: document.querySelector("#" + html_ids.FORM),
                config: "json/fx-catalog-modular-form-config.json",
                catalog: document.querySelector("#" + html_ids.FORM)
            });

            grid.init({
                container: document.querySelector("#" + html_ids.FORM),
                drag: {
                    handle: '.fx-catalog-modular-form-handler',
                    containment: "#" + html_ids.FORM
                },
                config: {
                    itemSelector: '.fx-catalog-form-module',
                    columnWidth: '.fx-catalog-form-module',
                    rowHeight: 0
                }
            });

            $.extend(form, {
                grid: grid
            });

            resume.init({
                container: document.querySelector("#" + html_ids.RESUME),
                catalog: document.querySelector("#" + html_ids.FORM)
            });

            // Perform dependency injection by extending objects
            $.extend(this.filterController, {
                menu: menu,
                form: form,
                resume: resume,
                submit: document.querySelector("#" + html_ids.SUBMIT)
            });

            return this.filterController;

        };

        Start.prototype.initBridge = function () {

            var bridge = new Bridge();
            bridge.init(this.o.bridge);
            return bridge;
        };

        Start.prototype.initResults = function () {

            var resultsController = new ResultController(),
                grid = new FilterableGrid(),
                renderer = new ResultsRenderer(this.o.results || {});

            grid.init({
                container: document.querySelector("#" + html_ids.RESULT),
                isotope: {
                    itemSelector: '.fenix-result',
                    layoutMode: 'fitRows'
                }
            });

            $.extend(resultsController, {
                resultsRenderer: renderer,
                grid: grid
            });

            return resultsController;
        };

        Start.prototype.destroy = function () {

            this.pageController.destroy();
        };

        return Start;

    });
