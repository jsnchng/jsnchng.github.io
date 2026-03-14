#!/usr/bin/env bash

# According to https://mirrors.tuna.tsinghua.edu.cn/help/rubygems/
# Change the default gem source
gem sources --add https://mirrors.tuna.tsinghua.edu.cn/rubygems/ --remove https://rubygems.org/
# Change the default bundler source
bundle config set --global mirror.https://rubygems.org https://mirrors.tuna.tsinghua.edu.cn/rubygems
