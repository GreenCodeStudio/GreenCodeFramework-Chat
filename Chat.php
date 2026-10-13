<?php

namespace Chat;

use Chat\Repository\ChatGroupRepository;
use Chat\Repository\ChatMessageRepository;
use Core\Database\DB;

class Chat
{

    public function getInterUserMessages(int $user1, int $user2)
    {
        return DB::get("
        SELECT cm.*, cm.user_id = :user1 as isMe, u.name as user_name, u.surname as user_surname
        FROM chat_message cm
        LEFT JOIN user u ON u.id = cm.user_id
                    WHERE (cm.user_id = :user1 AND cm.target_user_id = :user2) OR (cm.user_id = :user2 AND cm.target_user_id = :user1)
        ORDER BY cm.added DESC
        ", [
            'user1' => $user1,
            'user2' => $user2
        ]);
    }

    public function getGroupMessages(int $ownUserId, int $groupId)
    {
        return DB::get("
        SELECT cm.*, cm.user_id = :ownUserId as isMe, u.name as user_name, u.surname as user_surname
        FROM chat_message cm
        LEFT JOIN user u ON u.id = cm.user_id
                    WHERE cm.group_id = :groupId
        ORDER BY cm.added DESC
        ", [
            'ownUserId' => $ownUserId,
            'groupId' => $groupId
        ]);
    }

    public function sendMessage($data, $authorUserId)
    {
        if (!empty($data->targetUserId)) {
            $id = new ChatMessageRepository()->insert([
                'user_id' => $authorUserId,
                'target_user_id' => $data->targetUserId,
                'contentPlainText' => $data->contentPlainText,
                'added' => new \DateTime()
            ]);
        } else if (!empty($data->groupId)) {
            $id = new ChatMessageRepository()->insert([
                'user_id' => $authorUserId,
                'group_id' => $data->groupId,
                'contentPlainText' => $data->contentPlainText,
                'added' => new \DateTime()
            ]);
        }
    }

    public function getAllGroups()
    {
        return new ChatGroupRepository()->getAllGroups();
    }
}
