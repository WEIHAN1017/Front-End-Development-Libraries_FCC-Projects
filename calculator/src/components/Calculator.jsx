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

    // �p�G���~�A�M�����~�A�q�s��J�Ʀr�}�l
    if (error && /[0-9.]/.test(value)) {
      expr = ''
      setError(false)
    }

    // ���\ = �ᱵ�B��
    if (lastResult !== null && expr === '' && isOperator.test(value)) {
      expr = lastResult
    }

    // �B�z�p���I����
    if (value === '.') {
      const parts = expr.split(/[\+\-\*/()]/)
      const last = parts[parts.length - 1]
      if (last.includes('.')) return
    }

    // �קK�Ʀr�h�ӹs�}�Y
    if (value === '0') {
      const parts = expr.split(/[\+\-\*/]/)
      const last = parts[parts.length - 1]
      if (last === '0') return
    }

    // ? �֤߳B�z User Story #13
    if (isOperator.test(value)) {
      const match = expr.match(/[+\-*/]+$/)
      if (match) {
        const ops = match[0]

        // �Y�̫�O�@�ӹB��l�A�B�z�s������ΫO�d�t��
        if (ops.length === 1) {
          if (value === '-' && ops !== '-') {
            expr += value // ���\ *- �ܦ��t��
          } else {
            expr = expr.slice(0, -1) + value // �����̫�@��
          }
        } else {
          // �Y�̫ᬰ��ӥH�W�B���
          if (value === '-') {
            // �O�d�˼ƲĤG�� + �̫᪺ -
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

    // �@�뱡�p
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