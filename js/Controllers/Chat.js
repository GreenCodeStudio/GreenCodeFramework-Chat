import {FormManager} from "../../../Core/js/form";
import {AjaxTask} from "../../../Core/js/ajaxTask";
import {pageManager} from "../../../Core/js/pageManager";
import {DatasourceAjax} from "../../../Core/js/datasourceAjax";
import {ObjectsList} from "../../../Core/js/ObjectsList/objectsList";
import {t as TCommonBase} from "../../../CommonBase/i18n.xml";
import {TaskNotification} from "../../../Notifications/js/TaskNotification";
import {Ajax} from "../../../Core/js/ajax";
import {create} from "fast-creator";
import {t} from "../../i18n.xml";

export class index {
    constructor(page, data) {
        this.page = page;
        if (data.userMessages) {
            this.openConfig = {targetUserId: data.userId}
            this.loadUserChat(data.userMessages)
        }
        if (data.groupMessages) {
            this.openConfig = {groupId: data.groupId}
            this.loadGroupChat(data.groupMessages)
        }
        page.querySelector('.chat>aside').append(create('div.usersList', {},
                create('h3', {'text': t('users')}),
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
                ),
                create('h3', {'text': t('groups')}),
                create('ul', {}, ...data.groups.map(group =>
                        create('li', {},
                            create(
                                'a',
                                {
                                    href: `/Chat/group/${group.id}`,
                                    'text': group.name,
                                    onclick: () => {
                                        this.goToGroup(group.id);
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

    goToGroup(groupId) {
        history.pushState(null, '', `/Chat/group/${groupId}`);
    }

    loadUserChat(userMessages) {
        this.page.querySelector('.chatMainWrapper').append(
            create('.conversation', {}, ...userMessages.map(message => this.generateMessageElement(message)).reverse()),
            this.createMessageFormWrapper()
        )
    }
    loadGroupChat(groupMessages) {
        this.page.querySelector('.chatMainWrapper').append(
            create('.conversation', {}, ...groupMessages.map(message => this.generateMessageElement(message)).reverse()),
            this.createMessageFormWrapper()
        )
    }

    createMessageFormWrapper() {
        return create('.messageBoxWrapper', {},
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
    }

    async sendMessage(content) {
        await Ajax.Chat.sendMessage({
            ...this.openConfig,
            contentPlainText: content,
        })
        let messages;
        if(this.openConfig.targetUserId) {
            messages = (await Ajax.Chat.getInterUserMessages(this.openConfig.targetUserId)).reverse();
        }else{
            messages = (await Ajax.Chat.getGroupMessages(this.openConfig.groupId)).reverse();
        }
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
}

export class group extends index {
}
