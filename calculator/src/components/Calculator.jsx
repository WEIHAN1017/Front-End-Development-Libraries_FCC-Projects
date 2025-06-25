import { useState } from 'react'
import { evaluate as mathEval } from 'mathjs'
import { layoutConfig } from './layout.jsx'
import './Calculator.css'

export default function Calculator() {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [lastResult, setLastResult] = useState(null)

  const isOperator = /[+\-*/]/

  const handleInput = (value) => {
    if (value === 'C') {
      reset()
      return
    }

    if (value === '=') {
      calculateResult()
      return
    }

    let expr = input

    // 如果錯誤，清除錯誤，從新輸入數字開始
    if (error && /[0-9.]/.test(value)) {
      expr = ''
      setError(false)
    }

    // 允許 = 後接運算
    if (lastResult !== null && expr === '' && isOperator.test(value)) {
      expr = lastResult
    }

    // 處理小數點限制
    if (value === '.') {
      const parts = expr.split(/[\+\-\*/()]/)
      const last = parts[parts.length - 1]
      if (last.includes('.')) return
    }

    // 避免數字多個零開頭
    if (value === '0') {
      const parts = expr.split(/[\+\-\*/]/)
      const last = parts[parts.length - 1]
      if (last === '0') return
    }

    // ? 核心處理 User Story #13
    if (isOperator.test(value)) {
      const match = expr.match(/[+\-*/]+$/)
      if (match) {
        const ops = match[0]

        // 若最後是一個運算子，處理連續替換或保留負號
        if (ops.length === 1) {
          if (value === '-' && ops !== '-') {
            expr += value // 允許 *- 變成負號
          } else {
            expr = expr.slice(0, -1) + value // 替換最後一個
          }
        } else {
          // 若最後為兩個以上運算符
          if (value === '-') {
            // 保留倒數第二個 + 最後的 -
            const secondLast = ops[ops.length - 2]
            expr = expr.slice(0, -ops.length) + secondLast + '-'
          } else {
            expr = expr.slice(0, -ops.length) + value
          }
        }

        setInput(expr)
        setLastResult(null)
        return
      }
    }

    // 一般情況
    expr += value
    setInput(expr)
    setLastResult(null)
  }

  const calculateResult = () => {
    try {
      const raw = mathEval(input)
      const fixed = Number.parseFloat(raw).toFixed(10)
      const trimmed = parseFloat(fixed).toString()
      setLastResult(trimmed)
      setInput('')
      setError(false)
    } catch {
      setInput('Error')
      setError(true)
    }
  }

  const reset = () => {
    setInput('')
    setLastResult(null)
    setError(false)
  }

  return (
    <div className="calculator">
      <div id="display" className="display">{error ? 'Error' : input || lastResult || '0'}</div>
      <div className="button-grid">
        {layoutConfig.map((btn, i) => (
          <button
            key={i}
            id={btn.id}
            onClick={() => handleInput(btn.value)}
            className={btn.className || ''}
          >
            {btn.display}
          </button>
        ))}
      </div>
    </div>
  )
}