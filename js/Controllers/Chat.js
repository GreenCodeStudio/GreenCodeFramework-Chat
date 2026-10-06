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
        this.page = page;
        if (data.userMessages) {
            this.openConfig = {targetUserId: data.userId}
            this.loadUserChat(data.userMessages)
        }
        page.querySelector('.chat>aside').append(create('div.usersList', {},
                create('h3', {'text': 'UUUU'}),
                create('ul', {}, ...data.users.map(user =>
                        create('li', {},
                            create(
                                'a',
                                {
                                    href: `/Chat/user/${user.id}`,
                                    'text': user.name + ' ' + user.surname,
                                    onclick: () => {
                                        this.goToUser(user.id);
                                    }
                                }
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

    loadUserChat(userMessages) {
        this.page.querySelector('.chatMainWrapper').append(
            create('.conversation', {}, ...userMessages.map(message => this.generateMessageElement(message)).reverse()),
            create('.messageBoxWrapper', {},
                create('form', {},
                    create(
                        'textarea',
                        {
                            onkeydown: e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    this.sendMessage(e.target.value);
                                    e.target.value = '';
                                }
                            }
                        }
                    )
                )
            )
        )
    }

    async sendMessage(content) {
        await Ajax.Chat.sendMessage({
            ...this.openConfig,
            contentPlainText: content,
        })
        const messages = (await Ajax.Chat.getInterUserMessages(this.openConfig.targetUserId)).reverse();
        const conversation = this.page.querySelector('.conversation');
        for (const message of messages) {
            if (!conversation.querySelector(`.message[data-id="${message.id}"]`)) {
                conversation.append(this.generateMessageElement(message));
            }
        }
    }

    generateMessageElement(message) {
        console.log('message', message)
        return create('.message', {
            className: message.isMe ? 'isMe' : '',
            data: {id: message.id}
        }, create('.added', {text: message.added}), create('.content', {text: message.contentPlainText}));
    }
}

export class user extends index {
};
