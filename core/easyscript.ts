#!/usr/bin/env bun

import { fs } from "../compiler/lib/consts"
import { Compiler } from "../compiler/compiler"
import { setPack } from "../compiler/lib/util"
import { Err } from "./preload"

const path = process.argv[2]

if (!path) Err(`Specicy path run "easyscript path"!`)

if (fs.existsSync(`dist`)) fs.rmSync(`dist`, { recursive: true })

setPack()

Compiler.compile(path)
