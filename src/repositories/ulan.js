import got from 'got';
import config from '../config.js';

// Default RoleId = 'artist'
const ROLEID_DEFAULT = '31100';

const searchArtist = async (name, roleId = ROLEID_DEFAULT) => { 
    try {
        const result = await got.get({
            url: `http://${config.repositories.gettyVocabUrl}/ULANService.asmx/ULANGetTermMatch`,
            searchParams: {
                name: name.replace('\'', '\\\''),
                roleid: roleId,
                nationid: null
            }
          }
        );

        return result.body;
    } catch (e) {
        console.log(JSON.stringify(e, Object.getOwnPropertyNames()))
    }

}

const searchRole = async (roleText, roleId = "") => {
    try {
        const result = await got.get({
            url: `http://${config.repositories.gettyVocabUrl}/ULANService.asmx/ULANGetRoles`,
            searchParams: {
                role_text: roleText,
                role_id: roleId
            }
          }
        );
    
        return result.body;
    } catch (e) {
        console.log(JSON.stringify(e, Object.getOwnPropertyNames()))
    }

}


export default {
    searchArtist,
    searchRole
}