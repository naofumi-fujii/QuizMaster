import { put, call, takeLatest } from 'redux-saga/effects';
import { startSubmit, stopSubmit, reset } from 'redux-form';
import * as api from 'api';
import {
  CREATE_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION,
  createQuestionSuccess,
  createQuestionFailed,
  updateQuestionSuccess,
  updateQuestionFailed,
  deleteQuestionSuccess,
} from 'actions/questionFormActionCreators';
import { getMyQuizzes } from 'actions/myQuizzesActionCreators';
import {
  addWarningFlashMessage,
  addSuccessFlashMessage,
  removeAllFlashMessages,
} from 'actions/flashMessagesActionCreators';
import { browserHistory } from 'react-router';
import { QUESTION_FORM } from 'constants/form';
import ErrorHandler from './ErrorHandler';

export function* handleCreateQuestion(action) {
  try {
    yield put(startSubmit(QUESTION_FORM));
    const payload = yield call(api.createQuestion, action.payload.quizId, action.payload.values);
    yield put(createQuestionSuccess(payload));
    yield put(removeAllFlashMessages());
    yield put(addSuccessFlashMessage('Submission Succeeded'));
    yield put(reset(QUESTION_FORM));
    browserHistory.goBack();
  } catch (error) {
    yield put(createQuestionFailed(error));
    yield put(removeAllFlashMessages());
    if (error.response && error.response.data.validation_errors) {
      yield put(addWarningFlashMessage('Submission Failed'));
      yield put(stopSubmit(QUESTION_FORM, error.response.data.validation_errors));
    } else {
      const errorHandler = new ErrorHandler(error);
      yield errorHandler.handleError();
    }
  }
}

export function* handleUpdateQuestion(action) {
  try {
    yield put(startSubmit(QUESTION_FORM));
    const payload = yield call(
      api.updateQuestion, action.payload.questionId, action.payload.values,
    );
    yield put(updateQuestionSuccess(payload));
    yield put(removeAllFlashMessages());
    yield put(addSuccessFlashMessage('Submission Succeeded'));
    yield put(reset(QUESTION_FORM));
    browserHistory.goBack();
  } catch (error) {
    yield put(updateQuestionFailed(error));
    yield put(removeAllFlashMessages());
    if (error.response && error.response.data.validation_errors) {
      yield put(addWarningFlashMessage('Submission Failed'));
      yield put(stopSubmit(QUESTION_FORM, error.response.data.validation_errors));
    } else {
      const errorHandler = new ErrorHandler(error);
      yield errorHandler.handleError();
    }
  }
}

export function* handleDeleteQuestion(action) {
  try {
    yield call(api.deleteQuestion, action.payload);
    yield put(deleteQuestionSuccess(action.payload));
    yield put(removeAllFlashMessages());
    yield put(addSuccessFlashMessage('Deleted'));
  } catch (error) {
    const errorHandler = new ErrorHandler(error);
    yield errorHandler.handleError();
  }
}

export default function* diarySaga() {
  yield [
    takeLatest(CREATE_QUESTION, handleCreateQuestion),
    takeLatest(UPDATE_QUESTION, handleUpdateQuestion),
    takeLatest(DELETE_QUESTION, handleDeleteQuestion),
  ];
}
