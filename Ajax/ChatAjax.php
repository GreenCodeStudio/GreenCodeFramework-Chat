<?php

namespace Chat\Ajax;

use Authorization\Authorization;
use Chat\Chat;

class ChatAjax extends \Core\AjaxController
{
    public function sendMessage($data)
    {
        new Chat()->sendMessage($data, Authorization::getUserId());
    }

    public function getInterUserMessages(int $id)
    {
        return new Chat()->getInterUserMessages(Authorization::getUserId(), $id);
    }

    public function getGroupMessages(int $id)
    {
        return new Chat()->getGroupMessages(Authorization::getUserId(), $id);
    }
}
