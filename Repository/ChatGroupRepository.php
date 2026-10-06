<?php

namespace Chat\Repository;

use Core\Database\DB;

class ChatGroupRepository extends \Core\Repository{


    public function defaultTable(): string
    {
        return 'chat_group';
    }
    public function getAllGroups()
    {
        return DB::get("SELECT * FROM chat_group ORDER BY name ASC ");
    }
}
