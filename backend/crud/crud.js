import * as user from '../crud/user.js';
import * as friend from '../crud/friend.js';
import * as gamelog from '../crud/gamelog.js';
import * as tempuser from '../crud/tempuser.js';
import * as tournamentlog from '../crud/tournamentlog.js';
import * as chessgamelog from '../crud/chessgamelog.js';

export const crud = {
	user,
	gamelog,
	friend,
	chessgamelog,
	tempuser,
	tournamentlog
};


