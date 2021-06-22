import React from 'react';
import { Link, useParams, } from 'react-router-dom';
import { Button, Icon, Item, Segment } from 'semantic-ui-react';
import { Question } from '../../../app/models/question';
import { format } from 'date-fns';

interface Props {
    question: Question
}

export default function QuestionListItem({ question }: Props) {
    const { lessonId } = useParams<{ lessonId: string }>();
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