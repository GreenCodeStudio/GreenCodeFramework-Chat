<?php

namespace Chat\Repository;

class ChatMessageRepository extends \Core\Repository{


    public function defaultTable(): string
    {
        return 'chat_message';
    }
}
