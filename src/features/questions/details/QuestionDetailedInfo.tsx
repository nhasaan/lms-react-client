import { observer } from 'mobx-react-lite';
import React from 'react'
import { Segment, Grid, Icon, Button } from 'semantic-ui-react'
import { Question } from "../../../app/models/question";
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface Props {
    question: Question
}

export default observer(function QuestionDetailedInfo({ question }: Props) {
    return (
        <Segment.Group>
            <Segment attached='top'>
                <Grid>
                    <Grid.Column width={1}>
                        <Icon size='large' color='teal' name='info' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <p>{question.a}</p>
                        <p>{question.b}</p>
                        <p>{question.c}</p>
                        <p>{question.d}</p>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='calendar' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <span>
                            {format(new Date(question.created_at!), 'dd MMM yyyy h:mm aa')}
                        </span>
                    </Grid.Column>
                </Grid>
            </Segment>
            <Segment attached>
                <Grid verticalAlign='middle'>
                    <Grid.Column width={1}>
                        <Icon name='leanpub' size='large' color='teal' />
                    </Grid.Column>
                    <Grid.Column width={15}>
                        <Button
                            as={Link}
                            to={`/answerQuestion/${question.id}`}
                            color='teal'
                            floated='right'
                            content='Answer this Question'
                        />
                    </Grid.Column>
                </Grid>
            </Segment>
        </Segment.Group>
    )
})