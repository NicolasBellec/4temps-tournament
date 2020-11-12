// @flow
import { apiGetRequest, apiPostRequest } from '../util'
import isValidAccessKey from '../../../validators/validate-access-key'

export function getAccessKeysForTournament(tournamentId: string): Promise<Response> {
  return apiGetRequest(`/api/access-key/${tournamentId}`)
}

export function loginWithAccessKey(accessKey: string): Promise<Response> {
  if (!isValidAccessKey(accessKey)) {
    throw { isValidAccessKey: false, doesAccessKeyExist: true }
  }
  return apiPostRequest('/api/access-key/login', { accessKey })
}

export default getAccessKeysForTournament
