import {FormManager} from "../../../Core/js/form";
import {AjaxTask} from "../../../Core/js/ajaxTask";
import {pageManager} from "../../../Core/js/pageManager";
import {DatasourceAjax} from "../../../Core/js/datasourceAjax";
import {ObjectsList} from "../../../Core/js/ObjectsList/objectsList";
import {t as TCommonBase} from "../../../CommonBase/i18n.xml";
import {TaskNotification} from "../../../Notifications/js/TaskNotification";
import {Ajax} from "../../../Core/js/ajax";
import {create} from "fast-creator";

export class index {
    constructor(page, data) {
        console.log('aaaaaaa')
        page.querySelector('.chat>aside').append(create('div.usersList', {},
                create('h3', {'text': 'UUUU'}),
                create('ul', {}, ...data.users.map(user =>
                        create('li', {},
                            create(
                                'a',
                                {'text': user.name + ' ' + user.surname,
                                onclick: () => {
                                    this.goToUser(user.id);
                                }}
                            )
                        )
                    )
                )
            )
        );
    }
    goToUser(userId) {
        history.pushState(null, '', `/Chat/user/${userId}`);
    }
}
export class user extends index{};
