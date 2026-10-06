<?php

namespace Chat\Controllers;

use User\User;

class ChatController extends \Common\PageStandardController
{
    public function index()
    {
$this->addView('Chat','Chat');
    }
    public function index_data()
    {

        $users=(new User())->getAllSummary();
        return[
            'users'=>$users
        ];
    }
    public function user(int $id)
    {
        $this->addView('Chat','Chat');

    }
    public function user_data(int $id)
    {
        $ret=$this->index_data();
        $ret['userId']=$id;
        return $ret;
    }
}
