<?php

namespace Chat\Controllers;

use Authorization\Authorization;
use Chat\Chat;
use User\User;

class ChatController extends \Common\PageStandardController
{
    public function index()
    {
        $this->addView('Chat', 'Chat');
    }

    public function index_data()
    {

        $users = new User()->getAllSummary();
        $groups = new Chat()->getAllGroups();
        return [
            'users' => $users,
            'groups' => $groups
        ];
    }

    public function user(int $id)
    {
        $this->addView('Chat', 'Chat');

    }

    public function user_data(int $id)
    {
        $ret = $this->index_data();
        $ret['userId'] = $id;
        $ret['userMessages'] = new Chat()->getInterUserMessages(Authorization::getUserId(), $id);
        return $ret;
    }

    public function group(int $id)
    {
        $this->addView('Chat', 'Chat');

    }

    public function group_data(int $id)
    {
        $ret = $this->index_data();
        $ret['groupId'] = $id;
        $ret['groupMessages'] = new Chat()->getGroupMessages(Authorization::getUserId(), $id);
        return $ret;
    }
}
