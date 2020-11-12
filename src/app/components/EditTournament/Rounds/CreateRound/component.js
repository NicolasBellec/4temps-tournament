// @flow

import React, { Component } from 'react';
import {
  Header,
  Divider,
  Button,
  Message,
  Form,
  FormGroup,
  FormInput,
  FormRadio,
  FormField,
  Checkbox,
  SyntheticEvent,
} from 'semantic-ui-react';

import type { Element } from 'react';
import type { Props, RoundViewModel, CriterionViewModel } from './types';

type State = RoundViewModel;

class EditTournamentRounds extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      danceCount: null,
      minPairCountPerGroup: null,
      maxPairCountPerGroup: null,
      passingCouplesCount: null,
      multipleDanceScoringRule: 'average',
      criteria: [
        {
          name: '',
          description: '',
          minValue: null,
          maxValue: null,
          type: 'none',
          forJudgeType: 'normal',
        },
      ],
      errorOnSameScore: false,
      notationSystem: 'none',
    };
  }

  handleErrorOnSameScoreChange = (
    e: SyntheticEvent<HTMLInputElement>,
    { checked }: { checked: boolean },
  ) => {
    this.setState({ errorOnSameScore: checked });
  };

  onChangeName = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value });
  };

  onChangeDanceCount = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ danceCount: this.parseCount(event) });
  };

  onChangeMinPairCountPerGroup = (
    event: SyntheticInputEvent<HTMLInputElement>,
  ) => {
    this.setState({ minPairCountPerGroup: this.parseCount(event) });
  };

  onChangeMaxPairCountPerGroup = (
    event: SyntheticInputEvent<HTMLInputElement>,
  ) => {
    this.setState({ maxPairCountPerGroup: this.parseCount(event) });
  };

  onChangePassingCouplesCount = (
    event: SyntheticInputEvent<HTMLInputElement>,
  ) => this.setState({ passingCouplesCount: this.parseCount(event) });

  parseCount = (event: SyntheticInputEvent<HTMLInputElement>): ?number => {
    const count = parseInt(event.target.value);
    return isNaN(count) ? null : count;
  };

  onChangeMultipleDanceScoringRule = (
    event: SyntheticInputEvent<HTMLInputElement>,
    { value }: { value: MultipleDanceScoringRule },
  ) => this.setState({ multipleDanceScoringRule: value });

  onChangeNotationSystem = (
    event: SyntheticInputEvent<HTMLInputElement>,
    { value }: { value: NotationSystem },
  ) => this.setState({ notationSystem: value });

  countOrEmptyString = (count: ?number): string | number => (count != null ? count : '');

  renderDanceRule = () => {
    const { danceCount, multipleDanceScoringRule } = this.state;
    const { validation } = this.props;
    if (danceCount != null && danceCount > 1) {
      return (
        <span>
          <span className="field">
            <label htmlFor="dance-rule">
              How are the score of multiple dances handled?
            </label>
          </span>
          <FormGroup id="dance-rule" widths="equal">
            <FormRadio
              label="Average of all dances"
              value="average"
              onChange={this.onChangeMultipleDanceScoringRule}
              checked={multipleDanceScoringRule === 'average'}
            />
            <FormRadio
              label="Only the best dance"
              value="best"
              onChange={this.onChangeMultipleDanceScoringRule}
              checked={multipleDanceScoringRule === 'best'}
            />
          </FormGroup>
          {!validation.isValidMultipleDanceScoringRule && (
            <Message error content="Must pick at least one rule" />
          )}
        </span>
      );
    }
  };

  renderCriteria = (): Element<'div'>[] => this.state.criteria.map(this.renderCriterion);

  renderCriterion = (criterion: CriterionViewModel, index: number) => {
    const onChangeString = (key: string) => (event) => this.onChangeCriterion(
      {
        ...criterion,
        [key]: event.target.value,
      },
      index,
    );
    const onChangeInt = (key: string) => (event) => {
      this.onChangeCriterion(
        {
          ...criterion,
          [key]: this.parseCount(event),
        },
        index,
      );
    };

    const { validation } = this.props;

    const criterionValidation = index < validation.criteriaValidation.length
      ? validation.criteriaValidation[index]
      : {
        isValidCriterion: true,
        isValidName: true,
        isValidMinValue: true,
        isValidMaxValue: true,
        isValidValueCombination: true,
        isValidDescription: true,
      };

    return (
      <div key={index}>
        <FormGroup widths="equal">
          <FormInput
            label="Name"
            placeholder="Style"
            value={criterion.name}
            onChange={onChangeString('name')}
            error={!criterionValidation.isValidName}
          />
          <FormInput
            label="Description"
            placeholder="How well they incorporate their own style..."
            value={criterion.description}
            onChange={onChangeString('description')}
            error={!criterionValidation.isValidDescription}
          />
        </FormGroup>
        <FormGroup widths="equal">
          <FormInput
            label="Minimum value"
            placeholder="0"
            type="number"
            value={this.countOrEmptyString(criterion.minValue)}
            onChange={onChangeInt('minValue')}
            error={
              !criterionValidation.isValidMinValue
              || !criterionValidation.isValidValueCombination
            }
          />
          <FormInput
            label="Maximum value"
            placeholder="2"
            type="number"
            value={this.countOrEmptyString(criterion.maxValue)}
            onChange={onChangeInt('maxValue')}
            error={
              !criterionValidation.isValidMaxValue
              || !criterionValidation.isValidValueCombination
            }
          />
        </FormGroup>
        <Divider />
      </div>
    );
  };

  onChangeCriterion = (criterion: CriterionViewModel, index: number) => {
    const criteria = [...this.state.criteria];
    criteria[index] = criterion;
    this.setState({ criteria });
  };

  addCriterion = () => this.setState({
    criteria: [
      ...this.state.criteria,
      {
        name: '',
        description: '',
        minValue: null,
        maxValue: null,
        forJudgeType: 'normal',
        type: 'none',
      },
    ],
  });

  onSubmit = () => {
    // $FlowFixMe
    this.props.onSubmit(this.state);
  };

  render() {
    const { validation } = this.props;
    return (
      <Form error={!validation.isValidRound} loading={this.props.isLoading}>
        {this.props.createdSuccessfully && (
          <Message positive content="Success!" />
        )}
        <FormGroup widths="equal">
          <FormInput
            label="Name"
            placeholder="First round"
            value={this.state.name}
            onChange={this.onChangeName}
            error={!validation.isValidName}
          />
          <FormField error={!validation.isValidPassingCouplesCount}>
            <label htmlFor="couple-pass-count">
              Amount of
              {' '}
              <i>couples</i>
              {' '}
              that will proceed to the next round
            </label>
            <input
              id="couple-pass-count"
              placeholder="25"
              value={this.countOrEmptyString(this.state.passingCouplesCount)}
              onChange={this.onChangePassingCouplesCount}
            />
          </FormField>
        </FormGroup>
        <FormGroup widths="equal">
          <FormInput
            label="Amount of dances"
            placeholder="1"
            type="number"
            value={this.countOrEmptyString(this.state.danceCount)}
            onChange={this.onChangeDanceCount}
            error={!validation.isValidDanceCount}
          />
          <FormInput
            label="Minimum amount of couples per group"
            placeholder="3"
            type="number"
            value={this.countOrEmptyString(this.state.minPairCountPerGroup)}
            onChange={this.onChangeMinPairCountPerGroup}
            error={
              !validation.isValidMinPairCount
              || !validation.isMaxPairGreaterOrEqualToMinPair
            }
          />
          <FormInput
            label="Maximum amount of couples per group"
            placeholder="5"
            type="number"
            value={this.countOrEmptyString(this.state.maxPairCountPerGroup)}
            onChange={this.onChangeMaxPairCountPerGroup}
            error={
              !validation.isValidMaxPairCount
              || !validation.isMaxPairGreaterOrEqualToMinPair
            }
          />
        </FormGroup>
        <span>
          <span className="field">
            <label htmlFor="notation-system">
              What is the notation system ?
            </label>
          </span>
          <FormGroup id="notation-system" widths="equal">
            <FormRadio
              label="Score sum"
              value="sum"
              onChange={this.onChangeNotationSystem}
              checked={this.state.notationSystem === 'sum'}
            />
            <FormRadio
              label="RPSS"
              value="rpss"
              onChange={this.onChangeNotationSystem}
              checked={this.state.notationSystem === 'rpss'}
            />
          </FormGroup>
          {!validation.isValidNotationSystem && (
            <Message error content="Must pick at least one system" />
          )}
        </span>
        <FormGroup>
          <Checkbox
            toggle
            label={{ children: 'Treat equal score as error' }}
            checked={this.state.errorOnSameScore}
            onChange={this.handleErrorOnSameScoreChange}
          />
        </FormGroup>
        {this.renderDanceRule()}
        <Divider />
        <Header as="h2">
          Criteria
          <Button
            attached
            floated="right"
            content="Add another criterion"
            onClick={this.addCriterion}
          />
        </Header>
        {this.renderCriteria()}
        <Button type="submit" onClick={this.onSubmit}>
          Submit
        </Button>
      </Form>
    );
  }
}

export default EditTournamentRounds;
