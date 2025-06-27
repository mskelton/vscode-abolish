import { describe, expect, it } from 'vitest'
import { expandDictionary, expandPattern } from './expander'

describe('expandPattern', () => {
  it('should expand simple pattern with multiple options', () => {
    const result = expandPattern('{despa,sepe}rate', '{despe,sepa}rate')
    expect(result).toEqual({
      desparate: 'desperate',
      seperate: 'separate',
    })
  })

  it('should expand pattern with suffix options', () => {
    const result = expandPattern('test{s,ed,ing}', 'test{}')
    expect(result).toEqual({
      tested: 'tested',
      testing: 'testing',
      tests: 'tests',
    })
  })

  it('should expand the example pattern from the user', () => {
    const result = expandPattern(
      '{despa,sepe}rat{e,es,ed,ing,ely,ion,ions,or}',
      '{despe,sepa}rat{}',
    )
    expect(result).toEqual({
      desparate: 'desperate',
      desparated: 'desperated',
      desparately: 'desperately',
      desparates: 'desperates',
      desparating: 'desperating',
      desparation: 'desperation',
      desparations: 'desperations',
      desparator: 'desperator',
      seperate: 'separate',
      seperated: 'separated',
      seperately: 'separately',
      seperates: 'separates',
      seperating: 'separating',
      seperation: 'separation',
      seperations: 'separations',
      seperator: 'separator',
    })
  })

  it('should handle empty braces in replacement', () => {
    const result = expandPattern('pre{fix,pare}', 'pre{}')
    expect(result).toEqual({
      prefix: 'prefix',
      prepare: 'prepare',
    })
  })

  it('should handle patterns without braces', () => {
    const result = expandPattern('simple', 'replacement')
    expect(result).toEqual({
      simple: 'replacement',
    })
  })

  it('should handle multiple brace groups', () => {
    const result = expandPattern('{a,b}{1,2}', '{x,y}{}')
    expect(result).toEqual({
      a1: 'x1',
      a2: 'x2',
      b1: 'y1',
      b2: 'y2',
    })
  })
})

describe('expandDictionary', () => {
  it('should expand Abolish patterns in dictionary', () => {
    const dictionary = {
      '{despa,sepe}rate': '{despe,sepa}rate',
      another: 'word',
      simple: 'replacement',
    }

    const result = expandDictionary(dictionary)

    expect(result).toEqual({
      another: 'word',
      desparate: 'desperate',
      seperate: 'separate',
      simple: 'replacement',
    })
  })

  it('should handle complex dictionary with multiple patterns', () => {
    const dictionary = {
      '{despa,sepe}rat{e,es,ed,ing,ely,ion,ions,or}': '{despe,sepa}rat{}',
      'test{s,ed,ing}': 'test{}',
    }

    const result = expandDictionary(dictionary)

    expect(result['desparate']).toBe('desperate')
    expect(result['seperate']).toBe('separate')
    expect(result['desparation']).toBe('desperation')
    expect(result['tests']).toBe('tests')
    expect(result['tested']).toBe('tested')
    expect(Object.keys(result).length).toBe(19)
  })
})
