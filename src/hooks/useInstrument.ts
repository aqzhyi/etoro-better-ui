import { angularAPI } from '~/angularAPI'

export const useInstrument = (instrumentId: Instrument['InstrumentID']) => {
  const instrument = angularAPI.getInstrumentById(instrumentId)

  return instrument
}
