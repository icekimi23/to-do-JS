import template from './template.html';

const uuidv4 = require('uuid/v4');

export class ToDo {
    constructor(options) {
        this._el = options.el;
        // все элементы
        this._itemsToDo = {};
        // элементы, которые удовлетворяют фильтру, без фильтра это то же самое, что и _itemsToDo
        this._itemsToShow = {};
        // фильтр по полю done (может отсутствовать, быть true или false)
        this._filter = {};
        this._setListeners();
        this.render();
    }

    _setListeners() {
        this._el.addEventListener('keypress', this._onEnterPress.bind(this));
        this._el.addEventListener('click', this._onFilterChange.bind(this));
        this._el.addEventListener('click', this._onCompleteChange.bind(this));
        this._el.addEventListener('click', this._onDeleteClick.bind(this));
        this._el.addEventListener('click', this._onClearCompetedClick.bind(this));
    }

    _onEnterPress(event) {
        let target = event.target;
        if (!target.classList.contains('to-do__input') || event.keyCode !== 13) return;
        this.addItem(target.value);
        this.render();
        this._focus();
    }

    _onFilterChange(event) {
        let target = event.target;
        if (!target.closest('.to-do__list-footer-filter')) return;
        if (target.classList.contains('to-do__list-footer-filter-all')) {
            this.emptyFilter();
            this.render();
        } else if (target.classList.contains('to-do__list-footer-filter-active')) {
            this.setFilter(false);
            this.render();
        } else if (target.classList.contains('to-do__list-footer-filter-completed')) {
            this.setFilter(true);
            this.render();
        }
    }

    _onCompleteChange() {
        let target = event.target;
        let checkBoxElement = target.closest('.to-do__list-item-checkbox');
        if (!checkBoxElement) return;
        let control = checkBoxElement.querySelector('.to-do__list-item-checkbox-control');
        let id = target.closest('.to-do__list-item').id;
        if (control.checked) {
            this.completeItem(id);
        } else {
            this.uncompleteItem(id);
        }
        this.render();
    }

    _onDeleteClick() {
        let target = event.target;
        let deleteBtn = target.closest('.to-do__list-item-delete');
        if (!deleteBtn) return;
        let id = target.closest('.to-do__list-item').id;
        this.deleteItem(id);
        this.render();
    }

    _onClearCompetedClick() {
        let target = event.target;
        let clearCompletedBtn = target.closest('.to-do__list-footer-clear');
        if (!clearCompletedBtn) return;
        this.deleteCompleted();
        this.render();
    }

    _focus() {
        let input = this._el.querySelector('.to-do__input');
        input.focus();
    }

    addItem(text) {
        if (!text) return;
        let id = uuidv4();
        this._itemsToDo[id] = {
            text: text,
            done: false
        };
    }

    deleteItem(id) {
        delete this._itemsToDo[id];
    }

    deleteCompleted() {
        let toDelete = [];
        for (let id in this._itemsToDo) {
            let item = this._itemsToDo[id];
            if (item.done) {
                toDelete.push(id);
            }
        }
        toDelete.forEach((id) => {
            delete this._itemsToDo[id];
        });
    }

    completeItem(id) {
        this._itemsToDo[id].done = true;
    }

    uncompleteItem(id) {
        this._itemsToDo[id].done = false;
    }

    render() {
        this._filterItems();
        this._el.innerHTML = template({
            itemsInList: this.getQuantityToDo(),
            itemsToShow: this._itemsToShow,
            filter: this._filter.done === undefined ? 'all' : this._filter.done ? 'active' : 'completed'
        });
    }

    getQuantityToDo() {
        let count = 0;
        for (let id in this._itemsToDo) {
            let item = this._itemsToDo[id];
            if (!item.done) {
                count++;
            }
        }
        return count;
    }

    _filterItems() {
        this._itemsToShow = {};
        if (this._filter.done === undefined) this._itemsToShow = this._itemsToDo;
        for (let id in this._itemsToDo) {
            let item = this._itemsToDo[id];
            let done = item.done;
            if (done === this._filter.done) {
                this._itemsToShow[id] = item;
            }
        }
    }

    setFilter(value) {
        this._filter.done = value;
    }

    emptyFilter() {
        delete this._filter.done;
    }
}