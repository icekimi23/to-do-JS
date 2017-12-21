import template from './template.html';

export class ToDo {
    constructor(options) {
        this._el = options.el;
        this.render();
    }

    render(){
        this._el.innerHTML = template();
    }
}