// @flow

// To allow async functions with babel
import "regenerator-runtime/runtime";

import { ObjectID } from 'mongodb'
import type { TournamentRepository } from '../../data/tournament'
import { validateParticipant } from '../../validators/validate-participant'
import parse from 'csv-parse'

export class BatchCreateParticipantRoute {
  _tournamentRepository: TournamentRepository

  constructor(tournamentRepository: TournamentRepository) {
    this._tournamentRepository = tournamentRepository
  }

  route = async (req: ServerApiRequest, res: ServerApiResponse) => {
    if (!req.session.user) {
      res.sendStatus(401)
      return
    }

    const userId: string = req.session.user.id

    const handler = new BatchCreateParticipantRouteHandler(userId, this._tournamentRepository)

    handler.parseBody(req.body)
    await handler.createParticipants()

    res.status(handler.status)
    res.json({
      tournamentId: handler._tournamentId,
      participants: handler._participants,
    })
  }
}

export class BatchCreateParticipantRouteHandler {
  status: number = 200

  _userId: string

  _tournamentRepository: TournamentRepository

  _tournamentId: string

  _participants: Participant[] = []

  constructor(userId: string, tournamentRepository: TournamentRepository) {
    this._userId = userId
    this._tournamentRepository = tournamentRepository
  }

  // $FlowFixMe
  parseBody(body: mixed) {
    // $FlowFixMe
    this._tournamentId = body.tournamentId || ''
    // $FlowFixMe
    const csv: string = body.participants || ''

    parse(csv, {
      comment: '#', trim: true
      }, (err, output) => {
      if ( err ) {
        this.status = 500
        return
      }

      try {
        const participants = output.map(
          (entry) => {
            if ( entry.length !== 2 ) {
              console.log("Entry length != 2");
              throw "Entry length != 2";
            }
            return {
              name: entry[0],
              role: entry[1],
              isAttending: false
            };
          }
        );

        console.log("participants : ")
        console.log(participants)

        // $FlowFixMe
        this._participants = participants.map((participant) => ({
          id: new ObjectID().toString(),
          name: participant.name || '',
          role: participant.role || 'none',
          isAttending: participant.isAttending
        }))
      } catch(e) {
        console.log("status : 400");
        this.status = 400
        return
      }
    });
  }

  async createParticipants() {
    if ( this.status === 200 ) {
      console.log(this._participants)
      if (await this._isValidInput()) {
        await this._createForValidInput()
      } else {
        this.status = await this._reasonForInvalidInput()
      }
    }
  }

  async _isValidInput() {
    return (await this._isValidTournament()) && this._areValidParticipants()
  }

  _areValidParticipants() {
    return this._participants.reduce((acc, participant) =>
      acc && validateParticipant(participant).isValidParticipant,
      true
    );
  }

  async _isValidTournament() {
    const tournament = await this._tournamentRepository.get(this._tournamentId)
    return tournament != null
  }

  async _createForValidInput() {
    try {
      const tournamentRepository = this._tournamentRepository;
      this._participants.forEach(
        async (participant: Participant) => {
          await tournamentRepository.createParticipant(this._tournamentId, participant)
        }
      );
    } catch (e) {
      this.status = 500
    }
  }

  async _reasonForInvalidInput() {
    let status = 500

    if (!this._areValidParticipants()) {
      status = 400
    } else {
      status = this._reasonForInvalidTournament()
    }

    return status
  }

  async _reasonForInvalidTournament() {
    let status = 500
    const tournament = await this._tournamentRepository.get(this._tournamentId)
    if (tournament == null) {
      status = 404 // tournament does not exist
    }

    return status
  }
}

export default BatchCreateParticipantRoute
