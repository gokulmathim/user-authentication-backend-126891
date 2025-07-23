#!/bin/bash
cd /home/kavia/workspace/code-generation/user-authentication-backend-126891/user_authentication_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

