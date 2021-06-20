import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Grid, Header } from 'semantic-ui-react';
import { Question } from '../../../app/models/question';
import { useStore } from '../../../app/stores/store';
import AnswerForm from '../form/AnswerForm';
import QuestionListItem from './QuestionListItem';

export default observer(function QuestionList() {
    const { questionStore } = useStore();
    const { questionsByDate } = questionStore;
    const { lessonId } = useParams<{ lessonId: string }>();

    return (
        <>
            <Fragment>
                <Grid>
                    <Grid.Column width={8} >
                        <Header color='teal'>Question List</Header>
                    </Grid.Column>
                    <Grid.Column width={8} >
                        {questionsByDate.length !== 10 &&
                            <Button
                                as={Link}
                                to={`/createQuestion/${lessonId}`}
                                color='teal'
                                floated='right'
                                content='Create question'
                            />
                        }</Grid.Column>
                </Grid>
                {questionsByDate.map((question: Question, index) => (
                    <>
                        <QuestionListItem key={question.id} question={question} />
                        <AnswerForm key={index} question={question} />
                    </>
                ))}
                {questionsByDate &&
                    <Grid style={{ marginTop: '7em' }}>
                        <Grid.Column width={16} >
                            {questionsByDate.length === 0 &&
                                <Header sub style={{ marginBottom: '7em' }}>No questions found for this lesson!</Header>
                            }
                        </Grid.Column>
                    </Grid>
                }
            </Fragment>
        </>

    )
})