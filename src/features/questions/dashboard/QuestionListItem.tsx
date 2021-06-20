import React from 'react';
import { Link, } from 'react-router-dom';
import { Icon, Item, Segment } from 'semantic-ui-react';
import { Question } from '../../../app/models/question';
import { format } from 'date-fns';

interface Props {
    question: Question
}

export default function QuestionListItem({ question }: Props) {

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image style={{ marginBottom: 3 }} size='tiny' circular src={'/assets/categoryImages/film.jpg'} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/questions/${question.id}`}>
                                {question.title}
                            </Item.Header>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(new Date(question.created_at!), 'dd MMM yyyy h:mm aa')}
                </span>
            </Segment>
        </Segment.Group>
    )
}