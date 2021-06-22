import React from 'react';
import { Link, } from 'react-router-dom';
import { Item, Segment } from 'semantic-ui-react';
import { Question } from '../../../app/models/question';

interface Props {
    question: Question
}

export default function QuestionListItem({ question }: Props) {
    return (
        <>
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
        </>
    )
}