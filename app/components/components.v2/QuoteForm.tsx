'use client';

import { useQuotationForm } from '@app/hooks/useQuotationForm';
import { constants } from '../constants';
import ConsentText from '@app/quote/_components/ConsentText';
import PlaceAutocompleteInput from '../ui/PlaceAutocompleteInput';

export default function QuoteForm() {
  const {
    formData,
    updateFormData,
    updateMoveDateTime,
    handleSimpleSubmit,
    isSubmitting,
    isCompleted,
    errors,
    visibleServices,
    isLoading: servicesLoading,
    compareValue,
  } = useQuotationForm();

  const inputCls =
    'w-full px-4 py-3 bg-[rgba(253,250,245,0.06)] border border-[rgba(253,250,245,0.12)] rounded-xl text-white placeholder-[rgba(253,250,245,0.3)] text-sm outline-none focus:border-[#FD6232] focus:shadow-[0_0_0_3px_rgba(253,98,50,0.15)] transition-all font-sans';
  const labelCls =
    'block text-[12px] font-semibold text-[rgba(253,250,245,0.65)] tracking-wide mb-1.5';
  const errorCls = 'mt-1 text-[11px] text-red-400';

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSimpleSubmit();
  };

  const isMovingHelp = compareValue(formData.service_type, 'Moving Help');

  return (
    <section
      className="bg-gradient-to-b from-[#011a34] to-[#003467] py-20"
      id="quote"
    >
      <div className="max-w-[720px] mx-auto px-6 md:px-12">
        <div className="text-center mb-9">
          <p className="text-[11px] font-semibold tracking-[.12em] uppercase text-[#E8832A] mb-2">
            Book your move
          </p>
          <h2 className="font-serif font-bold text-white text-[36px] mb-2">
            Get a free quote
          </h2>
          <p className="text-[14px] text-[rgba(253,250,245,0.6)]">
            Or call us directly:{' '}
            <a
              href={`tel:${constants.companyPhone}`}
              className="text-[#FD6232] font-semibold hover:text-[#E8832A]"
            >
              {constants.companyPhone}
            </a>
          </p>
        </div>

        {!isCompleted ? (
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-3.5"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={labelCls}>Your Name *</label>
                <input
                  value={formData.first_name}
                  onChange={(e) => updateFormData('first_name', e.target.value)}
                  className={inputCls}
                  placeholder="Name"
                />
                {errors.first_name && (
                  <p className={errorCls}>{errors.first_name}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone_9f17}
                  onChange={(e) => updateFormData('phone_9f17', e.target.value)}
                  className={inputCls}
                  placeholder="+1 (204) 555-1234"
                />
                {errors.phone_9f17 && (
                  <p className={errorCls}>{errors.phone_9f17}</p>
                )}
              </div>
            </div>

            <div>
              <label className={labelCls}>Email Address *</label>
              <input
                type="email"
                value={formData.email_e1ca}
                onChange={(e) => updateFormData('email_e1ca', e.target.value)}
                className={inputCls}
                placeholder="yourname@example.com"
              />
              {errors.email_e1ca && (
                <p className={errorCls}>{errors.email_e1ca}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className={labelCls}>Service *</label>
                <select
                  value={formData.service_type}
                  onChange={(e) =>
                    updateFormData('service_type', e.target.value)
                  }
                  className={`${inputCls} appearance-none cursor-pointer`}
                  disabled={servicesLoading}
                >
                  <option value="" selected disabled>
                    {servicesLoading ? 'Loading…' : 'Select service…'}
                  </option>
                  {visibleServices.map((s) => (
                    <option key={s.id} value={s.info.name}>
                      {s.info.name}
                    </option>
                  ))}
                </select>
                {errors.service_type && (
                  <p className={errorCls}>{errors.service_type}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Move Date &amp; Time *</label>
                <input
                  type="datetime-local"
                  value={
                    formData.move_date && formData.move_time
                      ? `${formData.move_date}T${formData.move_time}`
                      : formData.move_date
                      ? `${formData.move_date}T`
                      : ''
                  }
                  onChange={(e) => {
                    const [date, time] = e.target.value.split('T');
                    if (date) updateMoveDateTime('move_date', date);
                    if (time) updateMoveDateTime('move_time', time);
                  }}
                  className={inputCls}
                />
                {errors.moving_address_date_and_time && (
                  <p className={errorCls}>
                    {errors.moving_address_date_and_time}
                  </p>
                )}
              </div>
            </div>

            <div>
              {/* <label className={labelCls}>Pickup Province/Territory *</label> */}
              <PlaceAutocompleteInput
                value={formData.unloading_address}
                onPlaceResolved={({ formatted_address }) =>
                  updateFormData('moving_address', formatted_address)
                }
                onClear={() => updateFormData('moving_address', '')}
                required={true}
                placeholder="City / Province"
                label="Where are you moving from?"
                fieldClassName={inputCls}
                // className=" block w-full rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                labelClassName={labelCls}
              />
              {/* <input
                value={formData.moving_address}
                onChange={(e) =>
                  updateFormData('moving_address', e.target.value)
                }
                className={inputCls}
                placeholder="Winnipeg, MB"
              /> */}
              {errors.moving_address && (
                <p className={errorCls}>{errors.moving_address}</p>
              )}
            </div>

            <div>
              {/* <label className={labelCls}>Delivery Province/Territory *</label> */}
              <PlaceAutocompleteInput
                value={formData.unloading_address}
                onPlaceResolved={({ formatted_address }) =>
                  updateFormData('unloading_address', formatted_address)
                }
                onClear={() => updateFormData('unloading_address', '')}
                required={!isMovingHelp}
                placeholder="City / Province"
                label="Where are you moving to?"
                fieldClassName={inputCls}
                className="mt-2 block w-full rounded-lg focus:ring-2 focus:ring-theme-orange focus:border-transparent transition-all duration-200"
                labelClassName={labelCls}
              />
              {/* <input
                value={formData.unloading_address}
                onChange={(e) =>
                  updateFormData('unloading_address', e.target.value)
                }
                className={inputCls}
                placeholder="Winnipg, MB"
              /> */}
              {errors.unloading_address && (
                <p className={errorCls}>{errors.unloading_address}</p>
              )}
            </div>
            <ConsentText />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-4 bg-[#FD6232] text-white font-semibold text-base rounded-full shadow-[0_4px_24px_rgba(253,98,50,0.28)] hover:bg-[#C44B1A] disabled:opacity-60 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                'Sending…'
              ) : (
                <>
                  Request Free Quote <span>→</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-10">
            <div className="w-14 h-14 rounded-full bg-[rgba(46,125,50,0.2)] border-2 border-[#2E7D32] text-[#2E7D32] text-2xl flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <h3 className="font-serif font-bold text-white text-[26px] mb-2">
              We&apos;ll be in touch soon!
            </h3>
            <p className="text-[14px] text-[rgba(253,250,245,0.7)] mb-6">
              We will contact you within a few hours to confirm your move
              details.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
