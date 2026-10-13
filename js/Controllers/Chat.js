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
        this.loadMessages(userMessages)
    }

    loadGroupChat(groupMessages) {
        this.loadMessages(groupMessages)
    }

    loadMessages(messages) {
        const conversation = create('.conversation', {});
        let prevMessage=null;
        for (const message of messages.reverse()) {
            const authorChanged=prevMessage?.user_id!==message.user_id;
            const addedChanged=prevMessage?.added!==message.added;
            conversation.append(this.generateMessageElement(message, authorChanged||addedChanged, addedChanged));
            prevMessage=message;
        }
        this.page.querySelector('.chatMainWrapper').append(
            create('.conversationWrapper', {}, conversation),
            this.createMessageFormWrapper()
        )

        this.page.querySelector('.conversationWrapper').scrollTop = this.page.querySelector('.conversationWrapper').scrollHeight;
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
                ),
                create('button', {
                    className: 'icon-send', type: 'submit', onclick: e => {
                        e.preventDefault();
                        this.sendMessage(e.target.previousSibling.value);
                        e.target.previousSibling.value = '';
                    }
                })
            )
        )
    }

    async sendMessage(content) {
        await Ajax.Chat.sendMessage({
            ...this.openConfig,
            contentPlainText: content,
        })
        let messages;
        if (this.openConfig.targetUserId) {
            messages = (await Ajax.Chat.getInterUserMessages(this.openConfig.targetUserId)).reverse();
        } else {
            messages = (await Ajax.Chat.getGroupMessages(this.openConfig.groupId)).reverse();
        }
        const conversation = this.page.querySelector('.conversation');
        for (const message of messages) {
            if (!conversation.querySelector(`.message[data-id="${message.id}"]`)) {
                conversation.append(this.generateMessageElement(message));
            }
        }
        conversation.parentElement.scrollTop = conversation.parentElement.scrollHeight;
    }

    generateMessageElement(message, showAuthor, showAdded) {
        console.log('message', message)
        return create('.message', {
                className: message.isMe ? 'message isMe' : 'message',
                data: {id: message.id}
            },
            showAdded?create('.added', {text: message.added}):null,
            showAuthor ? create('.author', {text: message.user_name + ' ' + message.user_surname}) : null,
            create('.content', {text: message.contentPlainText || '\u2007'}));
    }
}

export class user extends index {
}

export class group extends index {
}
