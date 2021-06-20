import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Form, Header, Icon, Item, Segment } from 'semantic-ui-react';
import { Question } from '../../../app/models/question';
import { format } from 'date-fns';
import MyTextInput from '../../../app/common/form/MyTextInput';
import AnswerForm from '../form/AnswerForm';

interface Props {
    question: Question
}

export default function QuestionListItem({ question }: Props) {
    const { lessonId } = useParams<{ lessonId: string }>();
    const selected = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const onSubmitAnswer = (question: Question, selected?: string) => {
        setIsSubmitting(true);
        console.log(question);
        console.log(selected);
    }

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


            {/* <Segment.Group> */}
            {/* <Segment clearing>
                <Header content='Submit a Answer' sub color='teal' />
            </Segment> */}
            <Segment clearing>
                <AnswerForm question={question} />
            </Segment>
            {/* </Segment.Group> */}
        </Segment.Group>
    )
}